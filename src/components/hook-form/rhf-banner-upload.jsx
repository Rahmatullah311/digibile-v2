import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';

import { Upload } from '../upload';
import { HelperText } from './help-text';

// ----------------------------------------------------------------------

export function RHFUploadBanner({ name, helperText, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles) => {
          const file = acceptedFiles[0];
          if (!file) return;

          const previewFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
          });

          setValue(name, previewFile, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        };

        const onDelete = () => {
          setValue(name, null, {
            shouldValidate: true,
            shouldDirty: true,
          });
        };

        return (
          <Box sx={{ width: '100%' }}>
            <Upload
              value={field.value}
              onDrop={onDrop}
              onDelete={onDelete}
              accept={{ 'image/*': [] }}
              multiple={false}
              thumbnail
              error={!!error}
              helperText={error?.message || helperText}
              {...other}
            />

            <HelperText errorMessage={error?.message} />
          </Box>
        );
      }}
    />
  );
}
