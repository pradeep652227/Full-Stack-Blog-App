import { Client, Storage, ID } from "appwrite";
const BUCKET_ID = String(import.meta.env.VITE_APPWRITE_BUCKET_ID);

export class Upload {
  client = new Client();
  storage;

  constructor() {
    this.client
      .setEndpoint(String(import.meta.env.VITE_APPWRITE_APPWRITE_URL))
      .setProject(String(import.meta.env.VITE_APPWRITE_PROJECT_ID));

    this.storage = new Storage(this.client);
  }

  async uploadImage(image) {
    try {
      const file = await this.storage.createFile(BUCKET_ID, ID.unique(), image);
      if (file) return file.$id;
      else return false;
    } catch (error) {
      console.log("Error in Creating File");
      throw error;
    }
  }

  async getImage(imageId) {
    try {
      const id = await this.storage.getFile(BUCKET_ID, imageId);
      if (id) return id;
      else return false;
    } catch (error) {
      console.log("Error in GetImage");
      throw error;
    }
  }

   getImagePreview(imageId){
    try {
     return this.storage.getFilePreview(BUCKET_ID,imageId);
        
    } catch (error) {
        console.log('Error in GetImagePreview');
        throw error;
    }   
  }
  async deleteImage(imageId) {
    try {
      const result = await this.storage.deleteFile(BUCKET_ID, imageId);
      if (result) return true;
      else return false;
    } catch (error) {
      console.log("Error in DeleteImage");
      throw error;
    }
  }
}

const upload=new Upload();
export default upload;