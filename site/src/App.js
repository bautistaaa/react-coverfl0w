import { Coverflow } from 'react-coverfl0w';
import './App.css';
const IMAGES = [
  {
    src:
      'https://format-com-cld-res.cloudinary.com/image/private/s--mTmfy_GJ--/c_limit,g_center,h_700,w_65535/fl_keep_iptc.progressive,q_95/v1/264a90899d665dbe2f555dd562d26fe3/bison-mountain.jpg?1049',
    href: 'https:www.bautistaphotos.com',
    alt: '2nd slide alt',
  },
  {
    src:
      'https://format-com-cld-res.cloudinary.com/image/private/s--pIRv4IDA--/c_limit,g_center,h_700,w_65535/fl_keep_iptc.progressive,q_95/v1/8d2bcfb17d30bfafdce840614f8350eb/rainbow-mountain.jpg?1049',
    href: 'https:www.bautistaphotos.com',
    alt: '1st slide alt',
  },
  {
    src:
      'https://format-com-cld-res.cloudinary.com/image/private/s--0ANnvAvT--/c_limit,g_center,h_700,w_65535/fl_keep_iptc.progressive,q_95/v1/8a24440efa438892dfc0a86928d5bc7f/cannon-beach-3.jpg?1049',
    href: 'https:www.bautistaphotos.com',
    alt: 'alt stuff',
  },
  {
    src:
      'https://format-com-cld-res.cloudinary.com/image/private/s--N1LQFDAt--/c_limit,g_center,h_700,w_65535/fl_keep_iptc.progressive,q_95/v1/d734fc0655442a315d3fd11e6807efa1/big_sur.jpg?1049',
    href: 'https:www.bautistaphotos.com',
    alt: 'alt stuff',
  },
  {
    src:
      'https://format-com-cld-res.cloudinary.com/image/private/s---dZDXqHn--/c_limit,g_center,h_700,w_65535/fl_keep_iptc.progressive,q_95/IMG_4411_fobq6i.jpg?700',
    href: '',
    alt: 'alt stuff',
  },
  {
    src:
      'https://format-com-cld-res.cloudinary.com/image/private/s--D1GArRJv--/c_limit,g_center,h_700,w_65535/fl_keep_iptc.progressive,q_95/v1/eee2687a6cdbba3dbbcee5d65eea16ac/sisters.jpg?1013',
    href: '',
    alt: 'asdasdasd',
  },
  {
    src:
      'https://format-com-cld-res.cloudinary.com/image/private/s--yVjQqfsf--/c_limit,g_center,h_700,w_65535/fl_keep_iptc.progressive,q_95/v1/88b3fbbca4d122610eb383f7a1bbfecf/bison-baby-road.jpg?1049',
    href: '',
    alt: 'asdasdasd',
  },
  {
    src:
      'https://format-com-cld-res.cloudinary.com/image/private/s--S-Q5A20v--/c_limit,g_center,h_700,w_65535/fl_keep_iptc.progressive,q_95/v1/987233c7e1914cb479ed285048560d95/mt-hood-2.jpg?1049',
    href: '',
    alt: 'asdasdasd',
  },
];

function App() {
  return (
    <div className="App">
      <div className="content">
        <Coverflow images={IMAGES} slidesPerSide={3} rotation={40} />
      </div>
    </div>
  );
}

export default App;
