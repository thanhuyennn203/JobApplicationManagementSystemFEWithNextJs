export const uploadFile = async (file: File) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:9191/api/companies/upload", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();

    return data.url;
};