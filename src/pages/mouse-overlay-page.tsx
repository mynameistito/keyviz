import { KEY_EVENT_STORE, KeyEventStore, useKeyEvent } from "@/stores/key_event";
import { KEY_STYLE_STORE, KeyStyleStore, useKeyStyle } from "@/stores/key_style";
import { listenForUpdates } from "@/stores/sync";
import { EventPayload } from "@/types/event";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

export function MouseOverlayPage() {
  const onEvent = useKeyEvent((state) => state.onEvent);
  const [isListening, setIsListening] = useState(true);

  useEffect(() => {
    const unlistenPromises = [
      listen<EventPayload>("input-event", (event) => onEvent(event.payload)),
      listenForUpdates<KeyEventStore>(KEY_EVENT_STORE, useKeyEvent.setState),
      listenForUpdates<KeyStyleStore>(KEY_STYLE_STORE, useKeyStyle.setState),
      listen<boolean>("listening-toggle", (event) => setIsListening(event.payload)),
    ];

    return () => {
      unlistenPromises.forEach((p) => p.then((f) => f()));
    };
  }, []);

  if (!isListening) return null;

  return null;
}
