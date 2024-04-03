import RingLoader from 'react-spinners/RingLoader';

export default function Loading() {
  return (
    <RingLoader
      color={'#000000'}
      loading={true}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}
