import { fetchData } from "./fetchData";

/**
 * TinyMCE file_picker_callback that uploads via company/upload.
 * Website API does not expose config/upcontentimg.
 *
 * @param {(message: string) => void} [onError]
 * @returns {(cb: Function, value: any, meta: any) => void}
 */
export function createTinyMceImagePicker(onError) {
  return (cb) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const imageFile = new FormData();
      imageFile.append("files", file, file.name);
      try {
        const data = await fetchData.infoCompany.uploadFile(imageFile);
        const fileLink =
          (data && (data.uploadKey || data.url || data.data)) ||
          (typeof data === "string" ? data : null);
        if (fileLink) {
          cb(fileLink, { title: file.name });
          return;
        }
        if (onError) onError("Upload ảnh thất bại");
      } catch (error) {
        if (onError) onError("Upload ảnh thất bại");
      }
    };
    input.click();
  };
}
