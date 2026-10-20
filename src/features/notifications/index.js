/**
 * Shared notifications domain (user + supplier). Each role keeps its own
 * `features/dash/<role>/notifications/` entry point that binds these
 * factories to its endpoints, slice name and link rewriter.
 */
export { createNotificationsApi } from "./notificationsApi";
export { createNotificationsThunks } from "./notificationsThunks";
export { createNotificationsSlice } from "./notificationsSlice";
export { createNotificationListMapper } from "./notificationsMappers";
