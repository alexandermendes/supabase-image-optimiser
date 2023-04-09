# Supabase Images Optimiser

A script for optimising images kept in Supabase storage.

It compresses image files and re-uploads them to Supabase.

## Usage

Run the script with:

```text
npx supabase-image-optimiser --url <PROJECT-URL> --key <SERVICE-ROLE-KEY> --bucket images --folder public
```

You can check the results of the compression by looking in the `./images` folder.

The following command line arguments are available.

| Argument   | Description                                               | Default     |
|------------|-----------------------------------------------------------|-------------|
| `--url`    | A Supabase project URL.                                   | -           |
| `--key`    | A Supabase service role key.                              | -           |
| `--bucket` | The Supabase bucket where your images are kept.           | -           |
| `--folder` | A folder within the bucket where your images are kept.    | -           |
| `--dry`    | Run without actually uploading anything to Supabase.      | -           |
| `--max n`  | Limit the conversion to the first *n* unconverted images. | 100         |
