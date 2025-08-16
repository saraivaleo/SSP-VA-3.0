
window.SSPVA_CONFIG = {
  brandName: "SSP‑VA 3.0",
  strings: {
    pt: {
      subtitle: "Calculadora probabilística de via aérea difícil (modelo logístico).",
      patientData: "Dados do paciente",
      patientId: "ID",
      notes: "Observações",
      modelVars: "Variáveis do modelo",
      clear: "Limpar",
      presetLow: "Preset: Baixo risco",
      presetHigh: "Preset: Alto risco",
      result: "Resultado",
      seeContrib: "Ver contribuição de cada variável",
      var: "Variável",
      copy: "Copiar resultado",
      print: "Imprimir / PDF",
      install: "Instalar app",
      aboutTitle: "Sobre o modelo",
      about1: "Este app implementa o SSP‑VA 3.0, um modelo logístico derivado por simulação informada pela literatura (TMHT, ULBT, abertura <3 cm, TMD<6 cm, mobilidade cervical, NC/TMD>5, achados de ultrassom, etc.). Os coeficientes β devem ser validados e calibrados no seu serviço antes de uso rotineiro.",
      about2: "Interpretação sugerida: p < 10% (baixo), 10–30% (intermediário), >30% (alto). Ajuste conforme a sua população.",
      footer: "© 2025 SSP‑VA – Uso educacional. Não substitui julgamento clínico.",
      usOn: "Ultrassom: ON",
      usOff: "Ultrassom: OFF",
      low: "Baixo",
      mid: "Intermediário",
      high: "Alto"
    },
    en: {
      subtitle: "Probabilistic difficult airway calculator (logistic model).",
      patientData: "Patient data",
      patientId: "ID",
      notes: "Notes",
      modelVars: "Model variables",
      clear: "Clear",
      presetLow: "Preset: Low risk",
      presetHigh: "Preset: High risk",
      result: "Result",
      seeContrib: "See contribution of each variable",
      var: "Variable",
      copy: "Copy result",
      print: "Print / PDF",
      install: "Install app",
      aboutTitle: "About the model",
      about1: "This app implements SSP‑VA 3.0, a logistic model derived via literature‑informed simulation (TMHT, ULBT, mouth opening <3 cm, TMD<6 cm, neck mobility, NC/TMD>5, ultrasound findings, etc.). Coefficients require validation/calibration before routine use.",
      about2: "Suggested interpretation: p < 10% (low), 10–30% (intermediate), >30% (high). Adjust to your population.",
      footer: "© 2025 SSP‑VA – Educational use. Does not replace clinical judgment.",
      usOn: "Ultrasound: ON",
      usOff: "Ultrasound: OFF",
      low: "Low",
      mid: "Intermediate",
      high: "High"
    }
  },
  # Ultrasound variable keys used in the model
  usKeys: ["DSE_high","Tongue_thick","HMDR_abn"]
};
