export interface Branch {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
}

export const CONTACT_PHONE_DISPLAY = '+91 8147 135 076';
export const CONTACT_PHONE_TEL = '+918147135076';

export const branches: Branch[] = [
  {
    id: 'girinagar',
    name: 'Girinagar Branch',
    address: '50 Ft Main Road, Nagendra Block, BSK 1st Stage, Banashankari, Bengaluru, Karnataka 560050',
    mapUrl:
      'https://www.google.com/maps/place/Brothers+Biriyani/@12.942317,77.5482986,1099m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bae3f673ddae057:0xb2c964b04b28238d!8m2!3d12.942317!4d77.5482986!16s%2Fg%2F11p00c9kzc!17m2!4m1!1e3!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxOC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    id: 'rr-nagar',
    name: 'RR Nagar Branch',
    address: 'Jnanakshi Residency Layout, 5th Stage, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098',
    mapUrl:
      'https://www.google.com/maps/place/Brothers+Biriyani+-+Top+Rated+Non+Veg+Restaurant+in+RR+Nagar/@12.9140625,77.5136875,1099m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bae3f0057303cad:0x8fb489949e0c8280!8m2!3d12.9140625!4d77.5136875!16s%2Fg%2F11vs12b9lj!17m2!4m1!1e3!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxOC4wIKXMDSoASAFQAw%3D%3D',
  },
  {
    id: 'kudlu-gate',
    name: 'Kudlu Gate Branch',
    address: 'Papannareddy Layout, Garebhavi Palya, Bengaluru, Karnataka 560068',
    mapUrl:
      'https://www.google.com/maps/place/Brothers+Biriyani+-+Kudlu+Gate/@12.893819,77.6367854,1099m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bae15009a475683:0xa4d348d716148634!8m2!3d12.893819!4d77.6367854!16s%2Fg%2F11z41v27jf?entry=ttu&g_ep=EgoyMDI2MTAxOC4wIKXMDSoASAFQAw%3D%3D',
  },
];
