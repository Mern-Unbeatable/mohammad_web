import { axiosInstance, bareAuthClient } from "./instances";
import { setupInterceptors } from "./interceptors";

setupInterceptors(axiosInstance);

export { axiosInstance, bareAuthClient };
export { crudService } from "./crudService";
