import '../styles/globals.css';
import { motion } from 'framer-motion';

function MyApp({ Component, pageProps }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Component {...pageProps} />
    </motion.div>
  );
}

export default MyApp;