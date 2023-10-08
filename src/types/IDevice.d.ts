export default interface IDevice {
  sn: number;
  csm: number;
  perangkat: string;
  jenis: string;
  nama: string;
  regional: number;
  use: number;
  nik: number;
  telp: number;
  notes: string;
  images: buffer[];
  isValid: boolean;
  validAt: Date;
}
