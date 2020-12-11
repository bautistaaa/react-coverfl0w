React Coverfl0w
===
[![npm version](https://badge.fury.io/js/react-coverfl0w.svg)](http://badge.fury.io/js/react-coverfl0w)
![gzip size](https://img.badgesize.io/https:/unpkg.com/react-coverfl0w?compression=gzip)

## Installation

To install, you can use [npm](https://npmjs.org/) or [yarn](https://yarnpkg.com):

    $ npm install --save react-coverfl0w
## API documentation
| Name                 | Type      | Default                                 | Description                                             |
|----------------------|-----------|-----------------------------------------|---------------------------------------------------------|
| images               | Image[]   |                                         | Array of Images {src, href, alt}                        |
| className            | string    |                                         | Add css class to the coverflow for customization        |
| slidesPerSide        | number    |                                         | Number of images displayed on either side of the center |
| roation              | number    | 45                                      | Rotation in degrees for inactive images                 |
| opacityInterval      | boolean   | [1, 0.8, 0.5, 0.2]                      | Define how you want images to "fade" out on the side    |
| scaleInterval        | boolean   | [1, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]  | Define how you want images to scale down in size        |

## Usage

```tsx
import { Coverflow, Images } from "react-coverfl0w";

const IMAGES: Images[] = [
  {
    src:
      "myimage.png",
    href: "https://www.test.com",
    alt: "alt"
  },
  {
    src:
      "myimage.png",
    href: "https://www.test.com",
    alt: "alt"
  },
];

function App() {
  return (
    <div className="App">
      <div className="content">
        <Coverflow images={IMAGES} slidesPerSide={3} />
      </div>
    </div>
  );
}

```
## Demos

* [Placeholder](placeholder)
