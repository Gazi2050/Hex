import * as React from 'react';
import * as NativeSvg from 'react-native-svg';

type SvgTagName =
  | 'path'
  | 'circle'
  | 'line'
  | 'rect'
  | 'polygon'
  | 'polyline'
  | 'ellipse';

type IconNodeEntry = readonly [
  SvgTagName,
  Readonly<Record<string, unknown>>,
];

type IconNode = readonly IconNodeEntry[];

const TAGS: Record<SvgTagName, React.ComponentType<any>> = {
  path: NativeSvg.Path,
  circle: NativeSvg.Circle,
  line: NativeSvg.Line,
  rect: NativeSvg.Rect,
  polygon: NativeSvg.Polygon,
  polyline: NativeSvg.Polyline,
  ellipse: NativeSvg.Ellipse,
};

const DEFAULT_SIZE = 24;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_COLOR = 'currentColor';

export interface IconProps
  extends Omit<React.ComponentProps<typeof NativeSvg.Svg>, 'children'> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

export type IconComponent = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<unknown>
>;

function createIcon(
  displayName: string,
  iconNode: IconNode,
): IconComponent {
  const Component = React.forwardRef<unknown, IconProps>(
    (
      {
        size = DEFAULT_SIZE,
        color = DEFAULT_COLOR,
        strokeWidth = DEFAULT_STROKE_WIDTH,
        absoluteStrokeWidth = false,
        ...rest
      },
      ref,
    ) => {
      const computedStrokeWidth = absoluteStrokeWidth
        ? (Number(strokeWidth) * DEFAULT_SIZE) / Number(size)
        : Number(strokeWidth);
      return (
        <NativeSvg.Svg
          ref={ref as React.Ref<React.ComponentRef<typeof NativeSvg.Svg>>}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={computedStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...rest}
        >
          {iconNode.map(([tag, attrs], index) => {
            const Cmp = TAGS[tag] ?? NativeSvg.Path;
            return <Cmp key={(attrs.d as string) ?? index} {...attrs} />;
          })}
        </NativeSvg.Svg>
      );
    },
  );
  Component.displayName = displayName;
  return Component;
}

export const Plus = createIcon('Plus', [
  ['path', { d: 'M5 12h14' }],
  ['path', { d: 'M12 5v14' }],
]);

export const Check = createIcon('Check', [
  ['path', { d: 'M20 6 9 17l-5-5' }],
]);

export const ChevronDown = createIcon('ChevronDown', [
  ['path', { d: 'm6 9 6 6 6-6' }],
]);

export const ChevronRight = createIcon('ChevronRight', [
  ['path', { d: 'm9 18 6-6-6-6' }],
]);

export const ChevronUp = createIcon('ChevronUp', [
  ['path', { d: 'm18 15-6-6-6 6' }],
]);

export const X = createIcon('X', [
  ['path', { d: 'M18 6 6 18' }],
  ['path', { d: 'm6 6 12 12' }],
]);

export const ChevronDownIcon = ChevronDown;
export const ChevronUpIcon = ChevronUp;

export type LucideIcon = IconComponent;
export type { IconProps as LucideProps };
