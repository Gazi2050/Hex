// Metro treats image files as numeric asset modules.
declare module "*.apng" {
  const asset: number;
  export default asset;
}
