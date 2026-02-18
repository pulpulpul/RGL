import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DnDPayload<T = unknown> {
  type: string;
  data: T;
  sourceWindowName: string;
  timestamp: number;
}

interface DragState {
  isDragging: boolean;
  isOver: boolean;
  payload: DnDPayload | null;
}

interface UseOpenFinDragSourceOptions<T> {
  /** Unique type identifier to match drag sources with drop targets */
  type: string;
  /** Data to transfer on drag */
  data: T;
  /** Called when drag starts */
  onDragStart?: (data: T) => void;
  /** Called when drag ends (regardless of drop success) */
  onDragEnd?: (data: T) => void;
  /** Whether dragging is disabled */
  disabled?: boolean;
}

interface UseOpenFinDropTargetOptions<T = unknown> {
  /** Type(s) to accept — matches against drag source type */
  acceptType: string | string[];
  /** Called when a valid item is dropped */
  onDrop: (payload: DnDPayload<T>) => void;
  /** Called when a dragged item enters the drop zone */
  onDragEnter?: (payload: DnDPayload<T>) => void;
  /** Called when a dragged item leaves the drop zone */
  onDragLeave?: () => void;
  /** Whether dropping is disabled */
  disabled?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const IAB_TOPIC_DRAG_START = 'dnd:drag-start';
const IAB_TOPIC_DRAG_END = 'dnd:drag-end';
const MIME_TYPE = 'application/x-openfin-dnd';

// ─── Utilities ───────────────────────────────────────────────────────────────


const getWindowName = async (): Promise<string> => {
  try {
    const win = await fin.Window.getCurrent();
    const info = await win.getInfo();
    return info.title || win.identity.name || 'unknown';
  } catch {
    return 'unknown';
  }
};

const publish = async (topic: string, payload: unknown): Promise<void> => {
  try {
    await fin.InterApplicationBus.publish(topic, payload);
  } catch (error) {
    console.warn(`[OpenFin DnD] Failed to publish "${topic}":`, error);
  }
};

// ─── Hook: Drag Source ───────────────────────────────────────────────────────

export function useOpenFinDragSource<T>({
  type,
  data,
  onDragStart,
  onDragEnd,
  disabled = false,
}: UseOpenFinDragSourceOptions<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  const handleDragStart = useCallback(
    async (e: React.DragEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      const windowName = await getWindowName();

      const payload: DnDPayload<T> = {
        type,
        data: dataRef.current,
        sourceWindowName: windowName,
        timestamp: Date.now(),
      };

      // Set data on native DataTransfer (works across OpenFin windows)
      e.dataTransfer.setData(MIME_TYPE, JSON.stringify(payload));
      e.dataTransfer.effectAllowed = 'move';

      // Notify other windows via IAB
      await publish(IAB_TOPIC_DRAG_START, payload);

      setIsDragging(true);
      onDragStart?.(dataRef.current);
    },
    [type, disabled, onDragStart]
  );

  const handleDragEnd = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();

      await publish(IAB_TOPIC_DRAG_END, { type });

      setIsDragging(false);
      onDragEnd?.(dataRef.current);
    },
    [type, onDragEnd]
  );

  const dragSourceProps = {
    draggable: !disabled,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    style: { cursor: disabled ? 'default' : 'grab' } as React.CSSProperties,
  };

  return { isDragging, dragSourceProps };
}

// ─── Hook: Drop Target ──────────────────────────────────────────────────────

export function useOpenFinDropTarget<T = unknown>({
  acceptType,
  onDrop,
  onDragEnter,
  onDragLeave,
  disabled = false,
}: UseOpenFinDropTargetOptions<T>) {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    isOver: false,
    payload: null,
  });

  const acceptTypes = Array.isArray(acceptType) ? acceptType : [acceptType];
  const acceptTypesRef = useRef(acceptTypes);
  acceptTypesRef.current = acceptTypes;

  const callbacksRef = useRef({ onDrop, onDragEnter, onDragLeave });
  callbacksRef.current = { onDrop, onDragEnter, onDragLeave };

  // ── Listen for IAB drag events from other windows ──

  useEffect(() => {
    if (disabled) return;

    const handleRemoteDragStart = (_: unknown, payload: DnDPayload<T>) => {
      if (acceptTypesRef.current.includes(payload.type)) {
        setState((prev) => ({ ...prev, isDragging: true, payload }));
      }
    };

    const handleRemoteDragEnd = () => {
      setState({ isDragging: false, isOver: false, payload: null });
    };

    const subscriptions: Array<() => void> = [];

    const setup = async () => {
      await fin.InterApplicationBus.subscribe(
        { uuid: '*' },
        IAB_TOPIC_DRAG_START,
        handleRemoteDragStart as any
      );
      subscriptions.push(() =>
        fin.InterApplicationBus.unsubscribe(
          { uuid: '*' },
          IAB_TOPIC_DRAG_START,
          handleRemoteDragStart as any
        )
      );

      await fin.InterApplicationBus.subscribe(
        { uuid: '*' },
        IAB_TOPIC_DRAG_END,
        handleRemoteDragEnd
      );
      subscriptions.push(() =>
        fin.InterApplicationBus.unsubscribe(
          { uuid: '*' },
          IAB_TOPIC_DRAG_END,
          handleRemoteDragEnd
        )
      );
    };

    setup();

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [disabled]);

  // ── Native drop target handlers ──

  const isValidPayload = useCallback(
    (e: React.DragEvent): DnDPayload<T> | null => {
      try {
        const raw = e.dataTransfer.getData(MIME_TYPE);
        if (!raw) return null;

        const payload: DnDPayload<T> = JSON.parse(raw);
        return acceptTypesRef.current.includes(payload.type) ? payload : null;
      } catch {
        return null;
      }
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    [disabled]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();

      setState((prev) => {
        if (!prev.isOver) {
          callbacksRef.current.onDragEnter?.(prev.payload as DnDPayload<T>);
        }
        return { ...prev, isOver: true };
      });
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;

      // Only trigger if leaving the actual drop zone (not a child element)
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const { clientX: x, clientY: y } = e;

      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setState((prev) => ({ ...prev, isOver: false }));
        callbacksRef.current.onDragLeave?.();
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();

      const payload = isValidPayload(e);
      if (payload) {
        callbacksRef.current.onDrop(payload);
      }

      setState({ isDragging: false, isOver: false, payload: null });
    },
    [disabled, isValidPayload]
  );

  const dropTargetProps = {
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };

  return {
    isOver: state.isOver,
    isDragging: state.isDragging,
    dropTargetProps,
  };
}

// ─── Combined hook for convenience ──────────────────────────────────────────

export function useOpenFinDnD<T>(options: {
  type: string;
  data?: T;
  onDrop?: (payload: DnDPayload<T>) => void;
  onDragStart?: (data: T) => void;
  onDragEnd?: (data: T) => void;
  onDragEnter?: (payload: DnDPayload<T>) => void;
  onDragLeave?: () => void;
  disabled?: boolean;
}) {
  const source = useOpenFinDragSource<T>({
    type: options.type,
    data: options.data as T,
    onDragStart: options.onDragStart,
    onDragEnd: options.onDragEnd,
    disabled: options.disabled || !options.data,
  });

  const target = useOpenFinDropTarget<T>({
    acceptType: options.type,
    onDrop: options.onDrop ?? (() => {}),
    onDragEnter: options.onDragEnter,
    onDragLeave: options.onDragLeave,
    disabled: options.disabled,
  });

  return { source, target };
}