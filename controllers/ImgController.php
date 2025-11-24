<?php

class ImgController
{
    static $maxSize = 1024 * 1024 * 5;
    static $typefiles = [
        "image/png" => "png",
        "image/jpeg" => "jpg"
    ];

    static $path = __DIR__ . "/../uploads/";

    public static function normalizePictures($pictures)
    {
        $files = [];
        if (is_array($pictures['name'])) {
            foreach ($pictures['name'] as $index => $name) {
                $files[] = [
                    "name" => $pictures['name'][$index],
                    "type" => $pictures['type'][$index],
                    "tmp_name" => $pictures['tmp_name'][$index],
                    "error" => $pictures['error'][$index],
                    "size" => $pictures['size'][$index]
                ];
            }
        } else {
            $files[] = $pictures;
        }
        return $files;
    }

    public static function randomName($extension)
    {
        $name = bin2hex(random_bytes(16));
        return $name . "." . $extension;
    }

    public static function upload($pictures)
    {
        $files = [];
        $errors = [];
        $saves = [];

        if ($pictures) {
            $files = self::normalizePictures($pictures);
        }

        foreach ($files as $index => $photo) {
            $err = $photo['error'] ?? UPLOAD_ERR_NO_FILE;
            if ($err === UPLOAD_ERR_NO_FILE)
                continue;
            if ($err !== UPLOAD_ERR_OK) {
                $errors[] = "Erro no upload (photo: {$index})";
                continue;
            }
            if (($photo['size'] ?? 0) > self::$maxSize) {
                $errors[] = "Excedeu o limite de" . self::$maxSize . "Mb -(photo: {$index})";
                continue;
            }
            $mime = null;

            if (class_exists('\finfo')) {
                $info = new \finfo(FILEINFO_MIME_TYPE);
                $mime = $info->file($photo['tmp_name']) ?: ($photo['type'] ?? "application/octet-stream");
            } elseif (function_exists('mime_content_type')) {
                $mime = mime_content_type($photo['tmp_name']) ?: ($photo['type'] ?? "application/octet-stream");
            } else {
                $mime = $photo['type'] ?? "application/octet-stream";
            }

            if (!isset(self::$typefiles[$mime])) {
                $errors[] = "Tipo do arquivo não é permitido";
                continue;
            }

            $photoName = self::randomName(self::$typefiles[$mime]);
            $destPath = self::$path . $photoName;
            if (!move_uploaded_file($photo['tmp_name'], $destPath)) {
                $errors[] = "Falha ao mover o arquivo";
                continue;
            }
            $saves[] = [
                "name" => $photoName,
                "path" => "//uploads//" . $photoName,
                "type" => self::$typefiles[$mime]
            ];
        }

        return [
            "files" => $files,
            "errors" => $errors,
            "saves" => $saves
        ];
    }

}
?>