/// <reference types="vite/client" />

// ─── Minimal OpenFin type declarations ──────────────────────────────────────

type OpenFinIABListener = (message: unknown, senderIdentity: { uuid: string; name: string }) => void;

interface OpenFinInterApplicationBus {
  publish(topic: string, message: unknown): Promise<void>;
  subscribe(identity: { uuid: string }, topic: string, listener: OpenFinIABListener): Promise<void>;
  unsubscribe(identity: { uuid: string }, topic: string, listener: OpenFinIABListener): Promise<void>;
}

interface OpenFinWindow {
  identity: { name: string };
  getInfo(): Promise<{ title?: string }>;
}

declare const fin: {
  Window: {
    getCurrent(): Promise<OpenFinWindow>;
  };
  InterApplicationBus: OpenFinInterApplicationBus;
};
