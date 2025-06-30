import React from "react";

export default function DemoEmbedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-500 text-white">
      <h1 className="text-2xl font-bold">Hello from the embedded bot!</h1>
      <p className="text-lg">
        This is a static demo page rendered for iframe embedding.
      </p>
      <p className="text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas porro
        asperiores, eos quae consectetur amet eaque facilis facere cumque fuga
        modi tempore excepturi minima accusantium totam harum laudantium
        blanditiis adipisci.
      </p>
    </div>
  );
}
