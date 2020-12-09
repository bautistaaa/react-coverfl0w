import allSettled from './allSettled';
import { FetchedItem, Images } from '../types';

const fetchImage = ({ src, href, alt }: { src: string; href: string; alt: string }) => {
  return new Promise<FetchedItem>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve({ image, href, alt });
    image.onerror = () => reject('Oops!');
  });
};

const fetchImages = (images: Images[]) => {
  const promises = images.map(fetchImage);
  return allSettled<FetchedItem>(promises);
};

export default fetchImages;
