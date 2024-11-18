import * as React from "react";
import { toast } from "sonner";
import { getErrorMessage } from "~/lib/handle-error";
import { createClient } from "~/utils/supabase/component";
import { type UploadedFile } from "~/types/types";
/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */
function useCallbackRef<T extends (...args: never[]) => unknown>(
  callback: T | undefined,
): T {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(
    () => ((...args) => callbackRef.current?.(...args)) as T,
    [],
  );
}
export { useCallbackRef };

/**
 * A custom hook to manage controllable state
 */
type UseControllableStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

type SetStateFn<T> = (prevState?: T) => T;

function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
    React.useCallback(
      (nextValue) => {
        if (isControlled) {
          const setter = nextValue as SetStateFn<T>;
          const value =
            typeof nextValue === "function" ? setter(prop) : nextValue;
          if (value !== prop) handleChange(value as T);
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, setUncontrolledProp, handleChange],
    );

  return [value, setValue] as const;
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, "prop">) {
  const uncontrolledState = React.useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  const handleChange = useCallbackRef(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
}

export { useControllableState };

interface UseUploadFileProps {
  defaultUploadedFiles?: any[];
  onUploadBegin?: () => void;
  onUploadProgress?: (progress: number) => void;
  headers?: Record<string, string>;
  skipPolling?: boolean;
}

interface UseUploadFileProps {
  defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
  folder: string,
  { defaultUploadedFiles = [] }: UseUploadFileProps = {},
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    const supabase = createClient();
    setIsUploading(true);
    try {
      const uploads = files.map(async (file) => {
        const filePath = `${folder}/${file.name}`;
        const { data, error } = await supabase.storage
          .from(`${process.env.FOLDER_NAME}`)
          .upload(filePath, file, {
            onUploadProgress: (progressEvent: {
              loaded: number;
              total: number;
            }) => {
              const progress =
                (progressEvent.loaded / progressEvent.total) * 100;
              setProgresses((prev) => ({
                ...prev,
                [file.name]: progress,
              }));
            },
          });

        if (error) {
          console.error("Error uploading file:", error);
          return;
        }

        return { name: file.name, path: data?.path };
      });

      const res = await Promise.all(uploads);
      setUploadedFiles((prev) => [...prev, ...res]);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
