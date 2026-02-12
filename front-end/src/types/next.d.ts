declare module 'next/dynamic' {
  import { ComponentType } from 'react';
  
  export interface DynamicOptions<P = Record<string, unknown>> {
    loading?: ComponentType<unknown>;
    loader?: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>;
    ssr?: boolean;
    suspense?: boolean;
  }

  function dynamic<P = Record<string, unknown>>(
    dynamicOptions: DynamicOptions<P> | (() => Promise<{ default: ComponentType<P> } | ComponentType<P>>),
    options?: DynamicOptions<P>
  ): ComponentType<P>;

  export default dynamic;
}

declare module 'next/image' {
  import { ComponentType } from 'react';
  
  export interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    loading?: 'lazy' | 'eager';
    fetchPriority?: 'high' | 'low' | 'auto';
    sizes?: string;
    style?: React.CSSProperties;
  }

  const Image: ComponentType<ImageProps>;
  export default Image;
}
