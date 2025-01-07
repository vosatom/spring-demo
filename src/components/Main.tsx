import { useState } from 'react';
import { Widget } from './Widget';
import { Button } from '@/components/ui/Button';

const Screen = () => {
  const [show, setShow] = useState(!false);

  return (
    <div className="container mx-auto py-10">
      <Widget show={show} />
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            react-spring and use-gesture demo
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Experiment with dragging the widget around, it also has edge
            gestures similar to those on iOS. Best experience on desktop device.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              onClick={() => {
                setShow((prev) => !prev);
              }}
              size="lg"
            >
              {show ? 'Close' : 'Open'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Screen;
