import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, CheckCircle } from "lucide-react";

export default function XRayUpload({ onFileUpload, uploadedFile, previewUrl, disabled }) {
  console.log("XRayUpload disabled:", disabled);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      onFileUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
          <FileImage className="w-6 h-6 text-blue-600" />
          צילום רנטגן *
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!disabled && (
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.svg,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        )}
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors bg-slate-50/50 ${
              disabled ? 'cursor-not-allowed border-slate-200' : 'hover:border-blue-400 cursor-pointer border-slate-300'
            }`}
            onClick={disabled ? undefined : handleBrowseClick}
          >


            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              העלה צילום רנטגן
            </h3>
            <p className="text-slate-600 mb-4">
              גרור קובץ לכאן או לחץ לבחירה
            </p>
            <Button variant="outline" className="gap-2" disabled={disabled}>
              <Upload className="w-4 h-4" />
              בחר קובץ
            </Button>
            <p className="text-xs text-slate-400 mt-4">
              נתמכים: JPG, JPEG, PNG, GIF, BMP, WEBP, TIFF, SVG, PDF
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {previewUrl && (
              <>
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-900">{uploadedFile.name}</p>
                    <p className="text-sm text-green-700">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white">
                  <img src={`${API_URL}/uploaded/${uploadedFile.name}`}
                       alt="צילום רנטגן"
                    className="w-full h-64 object-contain"
                  />
                </div>
              </>
            )}

            <Button
              variant="outline"
              onClick={disabled ? undefined : handleBrowseClick}
              disabled={disabled}
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              החלף קובץ
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}