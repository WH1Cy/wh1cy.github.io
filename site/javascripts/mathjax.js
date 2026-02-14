window.MathJax = {
  loader: { load: ["[tex]/unicode"] },
  tex: {
    packages: { "[+]": ["unicode"] },
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    macros: {
      degree: "^{\\circ}",
      degreeCelsius: "^{\\circ}\\mathrm{C}",
      lt: "<",
      gt: ">",
      bold: ["\\mathbf{#1}", 1],
      oiint: "\\mathop{\\unicode{x222F}}\\nolimits"
    }
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  }
};

document$.subscribe(() => {
  MathJax.startup.output.clearCache();
  MathJax.typesetClear();
  MathJax.texReset();
  MathJax.typesetPromise();
});
