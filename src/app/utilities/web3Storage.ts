import axios from "axios";

/**
 * Function to upload a Base64 encoded image to Pinata.
 * @param base64 - The Base64 string of the image (without the metadata prefix like 'data:image/png;base64,').
 * @param fileName - The name for the image file.
 * @returns The IPFS URL of the uploaded file.
 */
export async function uploadToPinata(
  buffer: Buffer,
  fileName: string
): Promise<string | null> {
  const pinataApiKey = "3f90eed68f228742d253";
  const pinataSecretApiKey =
    "7946b8eb3a26a4baa0184e68a1b478fb49b7887c288be2f1e1dd09f922e0f9c9";
  const pinataJwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmMjVhMDExYy1iYWI4LTQwNDMtYWI3My00YjkwMjBkMDRkNWEiLCJlbWFpbCI6InN1a3J1Y2FuLmVyY29iYW5Ac29seXRpY2tldC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2Y5MGVlZDY4ZjIyODc0MmQyNTMiLCJzY29wZWRLZXlTZWNyZXQiOiI3OTQ2YjhlYjNhMjZhNGJhYTAxODRlNjhhMWI0NzhmYjQ5Yjc4ODdjMjg4YmUyZjFlMWRkMDlmOTIyZTBmOWM5IiwiZXhwIjoxNzU5NDcwNTg0fQ.Y4UVf22pQb0oV4Sr26lqZoUDbF4RP-kRaYtCZmd7Wgw";
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  // Convert Base64 to Buffer
  // const buffer = Buffer.from(base64, "base64");
  const file = new File([buffer], fileName, { type: "image/png" }); // Change MIME type as necessary

  const formData = new FormData();
  formData.append("file", file);

  const metadata = JSON.stringify({
    name: fileName,
    keyvalues: {
      description: "Uploaded via Pinata API",
    },
  });
  formData.append("pinataMetadata", metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", options);

  try {
    const response = await axios.post(url, formData, {
      maxBodyLength: Infinity,
      headers: {
        Authorization: `Bearer ${pinataJwt}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Return the IPFS URL using the CID from the response
    const ipfsUrl = `${response.data.IpfsHash}`;
    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    return null;
  }
}
