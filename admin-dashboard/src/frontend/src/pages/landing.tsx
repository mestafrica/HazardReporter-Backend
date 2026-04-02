import landingImage from '../assets/images/landing.png';

const Landing = () => {
  return (
    <div>
      <div className="relative bg-no-repeat bg-cover  w-full h-screen overflow-hidden" style={{ backgroundImage: `url(${landingImage})` }}>
        <div className="absolute top-4 right-8">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl">
            Start
          </button>
        </div>
        <div className="absolute inset-0 flex flex-col items-start justify-center text-left text-white p-8">
          <h1 className="text-4xl font-bold">Environmental Hazard Reporting</h1>
          <h2 className="text-2xl mt-4">A Critical Step Towards a Safer Planet</h2>
        </div>
      </div>
      <div className="bg-white text-black p-8">
        <p className="text-lg">
          Accurate and timely environmental hazard reporting is essential for mitigating risks, protecting public health, and ensuring a sustainable future. By understanding the importance of documenting and addressing environmental hazards, we can foster a proactive approach to environmental stewardship and resilience.
        </p>
      </div>
      <div className='flex'>
        <span className="flex text-sm">
          By signing in to this platform, you agree with our Terms of Use and Privacy Policy.
        </span>
      </div>
      <div className='flex mt-4 space-x-2'>
        <span className='px-2 text-sm'>Help</span>
        <span className='px-2 text-sm'>Privacy</span>
        <span className='px-2 text-sm'>Terms</span>
      </div>



    </div>
  );
};

export default Landing;
