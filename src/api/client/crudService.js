import axiosInstance from './axiosInstance';

/**
 * Reusable Production-Level CRUD Service
 * Provides uniform wrapper methods for all HTTP requests across the application.
 */
export const crudService = {
  /**
   * GET Request
   * @param {string} url - API Endpoint path
   * @param {object} [params={}] - Query parameters
   * @param {object} [config={}] - Additional Axios Request Config
   */
  get: async (url, params = {}, config = {}) => {
    return await axiosInstance.get(url, { params, ...config });
  },

  /**
   * POST Request
   * @param {string} url - API Endpoint path
   * @param {object} data - Payload body data
   * @param {object} [config={}] - Additional Axios Request Config
   */
  post: async (url, data = {}, config = {}) => {
    return await axiosInstance.post(url, data, config);
  },

  /**
   * PUT Request
   * @param {string} url - API Endpoint path
   * @param {object} data - Payload body data
   * @param {object} [config={}] - Additional Axios Request Config
   */
  put: async (url, data = {}, config = {}) => {
    return await axiosInstance.put(url, data, config);
  },

  /**
   * PATCH Request
   * @param {string} url - API Endpoint path
   * @param {object} data - Payload body data
   * @param {object} [config={}] - Additional Axios Request Config
   */
  patch: async (url, data = {}, config = {}) => {
    return await axiosInstance.patch(url, data, config);
  },

  /**
   * DELETE Request
   * @param {string} url - API Endpoint path
   * @param {object} [config={}] - Additional Axios Request Config
   */
  del: async (url, config = {}) => {
    return await axiosInstance.delete(url, config);
  },

  /**
   * Multipart File Upload Request
   * @param {string} url - API Endpoint path
   * @param {FormData} formData - Form Data containing files/payload
   * @param {function} [onUploadProgress] - Optional progress callback function
   * @param {object} [config={}] - Additional Axios Request Config
   */
  upload: async (url, formData, onUploadProgress = null, config = {}) => {
    // Instance defaults to application/json; FormData needs multipart + boundary.
    return await axiosInstance.post(url, formData, {
      ...config,
      headers: {
        ...(config.headers || {}),
        "Content-Type": false,
      },
      onUploadProgress,
    });
  },
};

export default crudService;
