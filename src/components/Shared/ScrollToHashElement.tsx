import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHashElement = () => {
  const location = useLocation();

  const hashElement = useMemo(() => {
    const hash = location.hash;
    const removeHashCharacter = (str: string) => str.slice(1);

    if (hash) {
      const element = document.getElementById(removeHashCharacter(hash));
      return element;
    }

    return null;
  }, [location]);

  useEffect(() => {
    if (hashElement) {
      const navbarHeight = 84;
      const elementPosition =
        hashElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [hashElement]);

  return null;
};

export default ScrollToHashElement;
