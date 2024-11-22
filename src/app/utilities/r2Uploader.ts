import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Cloudflare R2 yapılandırması
const R2_ACCOUNT_ID = "eff91f1eb8dc7cc349b26c25935c63c4";
const R2_ACCESS_KEY_ID = "2e479c3554b7c0ae54cbb3226f7052f4";
const R2_SECRET_KEY_ID =
  "0d8de6ae5256644e6fc069f7409aa3c35439e56a5a186f01ec21aa092f3c5c42";
const R2_BUCKET_NAME = "solyticket";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_KEY_ID!,
  },
});

export const uploadFileToR2 = async (file: File, name: string) => {
  try {
    const signedUrl = await getSignedUrl(
      R2,
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME!,
        Key: `resources/${name}`, // Dosyanın R2'deki yolu
        ContentType: file.type, // Dosya tipi
      }),
      { expiresIn: 3600 } // 1 saat geçerli
    );

    // İmzalı URL ile dosyayı R2'ye yükle
    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (response.ok) {
      console.log("Dosya başarıyla yüklendi.");
      return { success: true };
    } else {
      console.error("Dosya yükleme hatası:", response.statusText);
      return { success: false };
    }
  } catch (error) {
    console.error("Dosya yükleme sırasında hata oluştu:", error);
    return { success: false };
  }
};

export const deleteFileFromR2 = async (key: string) => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME!,
      Key: key, // Silinecek dosyanın yolu
    });

    const response = await R2.send(deleteCommand);

    if (response.$metadata.httpStatusCode === 204) {
      console.log("Dosya başarıyla silindi:", key);
      return { success: true };
    } else {
      console.error("Dosya silme hatası:", response);
      return { success: false };
    }
  } catch (error) {
    console.error("Dosya silme sırasında hata oluştu:", error);
    return { success: false };
  }
};
