/**
 * Módulo responsável por manter o viewport do player em 1536x864
 * proporcional e perfeitamente centralizado em qualquer resolução de display.
 */
export function setupScaler(targetElementId: string = 'screen'): () => void {
  const el = document.getElementById(targetElementId);
  if (!el) return () => {};

  const fit = () => {
    const s = Math.min(window.innerWidth / 1536, window.innerHeight / 864);
    el.style.transform = `scale(${s})`;
    el.style.left = `${(window.innerWidth - 1536 * s) / 2}px`;
    el.style.top = `${(window.innerHeight - 864 * s) / 2}px`;
  };

  window.addEventListener('resize', fit);
  fit();

  return () => window.removeEventListener('resize', fit);
}
