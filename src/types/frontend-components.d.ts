/**
 * Frontend components do not provide TS typings so we have to define them
 */
declare module '@redhat-cloud-services/frontend-components/components/cjs/DateFormat' {
  export interface DateFormatTooltipProps {
    [key: string]: number | string;
  }
  export interface DateFormatProps {
    date: Date | string | number;
    type?: 'exact' | 'onlyDate' | 'relative';
    extraTitle?: string;
    tooltipProps?: DateFormatTooltipProps;
  }
  export const DateFormat: React.ComponentType<DateFormatProps>;
}
