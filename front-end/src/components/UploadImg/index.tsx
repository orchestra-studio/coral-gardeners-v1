"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import {
  IconPhoto,
  IconUpload,
  IconLoader,
  IconCopy,
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import styles from "./UploadImg.module.css";

interface UploadImgProps {
  className?: string;
}

const UploadImg: React.FC<UploadImgProps> = ({ className = "" }) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [url, setUrl] = useState("");

  const previewImage = (image: File | null) => {
    setUrl("");
    try {
      if (image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(image);
      } else {
        setPreview(null);
      }
    } catch (error) {
      console.error("Error previewing image:", error);
    }
  };

  const upload = async () => {
    if (!files || !files[0]) return;

    if (files[0].size > 2097152) {
      toast.error(
        "Image max size is 2 megabytes, choose another image with smaller size"
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("path", "admin_emails");
    formData.append("for", "default");

    setDisabled(true);
    try {
      // This would need to be implemented in your API
      // const response = await adminApi.uploadFile(formData);
      // For now, simulating the upload
      setTimeout(() => {
        const mockUrl = `https://example.com/uploads/${Date.now()}_${
          files[0].name
        }`;
        setUrl(mockUrl);
        setDisabled(false);
        toast.success("Image uploaded successfully!");
      }, 2000);
    } catch (error) {
      setDisabled(false);
      toast.error("Failed to upload image");
      console.error("Upload error:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to copy URL");
      console.error("Copy error:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2097152) {
      toast.error(
        "Image max size is 2 megabytes, choose another image with smaller size"
      );
      return;
    }
    previewImage(file || null);
    setFiles(e.target.files);
  };

  return (
    <div className={className}>
      <Button onClick={() => setOpen(true)} variant="outline" className="gap-2">
        <IconPhoto size={16} />
        Upload IMG
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Upload image"
        size="md"
      >
        <div className={styles.container}>
          <div className={styles.previewContainer}>
            <label htmlFor="inputFile" className={styles.addFileBtn}>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Preview"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.placeholderContent}>
                  <div className={styles.animatedCircles}>
                    <div className={`${styles.circle} ${styles.circle1}`} />
                    <div className={`${styles.circle} ${styles.circle2}`} />
                    <div className={`${styles.circle} ${styles.circle3}`} />
                    <div className={`${styles.circle} ${styles.circle4}`} />
                  </div>
                  <IconPhoto size={24} />
                </div>
              )}
            </label>
          </div>

          <div className="w-full text-sm text-[var(--text-muted)] mb-4">
            *Image max size is 2 megabytes
          </div>

          <div className={styles.urlContainer}>
            <div className={styles.url}>
              {url ? url.substring(0, 30) + "..." : "Generated URL..."}
            </div>
            {url && (
              <Button
                onClick={copyToClipboard}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <IconCopy size={14} />
                Copy
              </Button>
            )}
          </div>

          {!url && (
            <Button
              onClick={upload}
              disabled={disabled || !files}
              variant="default"
              className="w-full mt-4 gap-2"
            >
              {disabled ? (
                <IconLoader size={16} className="animate-spin" />
              ) : (
                <IconUpload size={16} />
              )}
              Generate URL
            </Button>
          )}

          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="inputFile"
            onChange={handleFileChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UploadImg;
