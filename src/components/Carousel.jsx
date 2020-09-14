import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';
import Img1 from './../assets/login1.jpg'
import Img2 from './../assets/login2.webp'
import Img3 from './../assets/login3.webp'

const items = [
  {
    src: Img1,
    altText: 'Slide 1',
    caption: 'Slide 1',
    header: 'Slide 1 Header',
    key: '1'
  },
  {
    src: Img2,
    altText: 'Slide 2',
    caption: 'Slide 2',
    header: 'Slide 2 Header',
    key: '2'
  },
  {
    src: Img3,
    altText: 'Slide 3',
    caption: 'Slide 3',
    header: 'Slide 3 Header',
    key: '3'
  }
];

const Example = () => <UncontrolledCarousel items={items} />;

export default Example;