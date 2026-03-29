const enfermeiroAtencaoPrimaria = [
  {
    id: "enf_ap_hipertenso",
    nome: "Hipertenso",
    descricao: "Consulta de enfermagem ao paciente hipertenso",
    grupos: [
      {
        titulo: "Motivo da Consulta",
        campo: "queixa_principal",
        opcoes: ["Consulta de enfermagem de rotina — HAS", "Renovação de receita", "Cefaleia", "Tontura", "Palpitações", "Edema", "Assintomático"],
      },
      {
        titulo: "Avaliação de Enfermagem",
        campo: "hda",
        opcoes: ["Uso regular da medicação", "Uso irregular da medicação", "Dieta hipossódica", "Dieta inadequada", "Prática de atividade física regular", "Sedentário", "Controle de PA domiciliar", "Tabagista", "Ex-tabagista", "Etilista"],
      },
      {
        titulo: "Exame Físico",
        campo: "exame_fisico",
        opcoes: ["BEG, lúcido, orientado", "Corado, hidratado", "AC: sem alterações", "AP: sem alterações", "Abdome sem alterações", "MMII sem edema", "MMII com edema", "Pulsos periféricos presentes"],
      },
      {
        titulo: "Sinais Vitais",
        campo: "sinais_vitais",
        opcoes: ["PA dentro da meta", "PA acima da meta", "FC normal", "Peso aferido", "IMC calculado", "Circunferência abdominal aferida"],
      },
      {
        titulo: "Diagnóstico de Enfermagem",
        campo: "avaliacao",
        opcoes: ["Controle ineficaz da saúde", "Risco de perfusão tissular cardíaca diminuída", "Estilo de vida sedentário", "Nutrição desequilibrada", "Ansiedade", "Conhecimento deficiente sobre a doença"],
      },
      {
        titulo: "Intervenções de Enfermagem",
        campo: "conduta",
        opcoes: ["Aferição e registro de PA", "Orientações sobre uso correto da medicação", "Orientações sobre dieta hipossódica", "Orientações sobre atividade física", "Orientações sobre cessação do tabagismo", "Estratificação de risco cardiovascular", "Encaminhamento para consulta médica", "Encaminhamento para nutricionista", "Agendamento de retorno"],
      },
    ],
  },
  {
    id: "enf_ap_diabetico",
    nome: "Diabético",
    descricao: "Consulta de enfermagem ao paciente diabético",
    grupos: [
      {
        titulo: "Motivo da Consulta",
        campo: "queixa_principal",
        opcoes: ["Consulta de enfermagem de rotina — DM", "Renovação de receita", "Hipoglicemia", "Hiperglicemia", "Ferida em membro inferior", "Formigamento em extremidades", "Assintomático"],
      },
      {
        titulo: "Avaliação de Enfermagem",
        campo: "hda",
        opcoes: ["Uso regular da medicação/insulina", "Uso irregular da medicação", "Automonitorização glicêmica regular", "Dieta adequada", "Dieta inadequada", "Atividade física regular", "Sedentário", "Cuidados com os pés adequados", "Cuidados com os pés inadequados"],
      },
      {
        titulo: "Exame Físico",
        campo: "exame_fisico",
        opcoes: ["BEG, lúcido, orientado", "Corado, hidratado", "Pele íntegra", "Presença de lesão", "Exame dos pés: sem alterações", "Exame dos pés: calosidades", "Exame dos pés: micose", "Exame dos pés: sensibilidade preservada", "Exame dos pés: sensibilidade diminuída", "MMII sem edema", "MMII com edema", "Locais de aplicação de insulina sem lipodistrofia", "Locais de aplicação com lipodistrofia"],
      },
      {
        titulo: "Sinais Vitais",
        campo: "sinais_vitais",
        opcoes: ["PA normal", "PA elevada", "Glicemia capilar dentro da meta", "Glicemia capilar acima da meta", "Glicemia capilar abaixo de 70", "Peso aferido", "IMC calculado"],
      },
      {
        titulo: "Diagnóstico de Enfermagem",
        campo: "avaliacao",
        opcoes: ["Risco de glicemia instável", "Integridade da pele prejudicada", "Controle ineficaz da saúde", "Conhecimento deficiente sobre autocuidado", "Risco de infecção", "Nutrição desequilibrada", "Perfusão tissular periférica ineficaz"],
      },
      {
        titulo: "Intervenções de Enfermagem",
        campo: "conduta",
        opcoes: ["Glicemia capilar aferida e registrada", "Orientações sobre automonitorização", "Orientações sobre técnica de aplicação de insulina", "Orientações sobre rodízio de locais de aplicação", "Orientações sobre cuidados com os pés", "Orientações sobre dieta para diabético", "Orientações sobre sinais de hipo/hiperglicemia", "Realizado curativo em lesão", "Encaminhamento para consulta médica", "Encaminhamento para nutricionista", "Agendamento de retorno"],
      },
    ],
  },
  {
    id: "enf_ap_prenatal",
    nome: "Pré-natal",
    descricao: "Consulta de enfermagem pré-natal",
    grupos: [
      {
        titulo: "Motivo da Consulta",
        campo: "queixa_principal",
        opcoes: ["Consulta de pré-natal de rotina", "Primeira consulta de pré-natal", "Náuseas / vômitos", "Dor lombar", "Edema", "Cefaleia", "Queixas urinárias", "Assintomática"],
      },
      {
        titulo: "Dados Obstétricos",
        campo: "hda",
        opcoes: ["DUM informada", "IG compatível", "Primigesta / Multigesta", "Movimentos fetais presentes", "Movimentos fetais diminuídos", "Uso de sulfato ferroso e ácido fólico", "Vacinação em dia", "Vacinação pendente", "Aleitamento materno prévio", "Resultado de exames anteriores sem alterações"],
      },
      {
        titulo: "Exame Físico",
        campo: "exame_fisico",
        opcoes: ["BEG, corada, hidratada", "Mamas: sem alterações", "AU compatível com IG", "AU abaixo do esperado", "BCF presente e regular", "Edema: ausente", "Edema em MMII", "Abdome gravídico"],
      },
      {
        titulo: "Sinais Vitais",
        campo: "sinais_vitais",
        opcoes: ["PA normal", "PA elevada", "Peso aferido", "Ganho de peso adequado", "Ganho de peso excessivo", "Ganho de peso insuficiente", "Temperatura normal"],
      },
      {
        titulo: "Diagnóstico de Enfermagem",
        campo: "avaliacao",
        opcoes: ["Gestação em evolução adequada", "Risco de nutrição desequilibrada", "Ansiedade relacionada à gestação", "Conhecimento deficiente sobre gestação e parto", "Risco de infecção urinária", "Náuseas", "Conforto prejudicado"],
      },
      {
        titulo: "Intervenções de Enfermagem",
        campo: "conduta",
        opcoes: ["Aferição de altura uterina e BCF", "Verificação de cartão de pré-natal", "Solicitação de exames conforme protocolo", "Prescrição de sulfato ferroso e ácido fólico", "Orientações sobre alimentação na gestação", "Orientações sobre sinais de alerta", "Orientações sobre aleitamento materno", "Orientações sobre parto e puerpério", "Atualização vacinal", "Encaminhamento para consulta médica", "Encaminhamento para pré-natal de alto risco", "Agendamento de retorno conforme IG"],
      },
    ],
  },
  {
    id: "enf_ap_puericultura",
    nome: "Puericultura",
    descricao: "Consulta de enfermagem à criança",
    grupos: [
      {
        titulo: "Motivo da Consulta",
        campo: "queixa_principal",
        opcoes: ["Consulta de puericultura de rotina", "Primeira consulta do RN", "Dificuldade na amamentação", "Cólicas", "Choro excessivo", "Assintomático"],
      },
      {
        titulo: "Alimentação e Desenvolvimento",
        campo: "hda",
        opcoes: ["Aleitamento materno exclusivo", "Aleitamento materno complementado", "Uso de fórmula", "Alimentação complementar iniciada", "DNPM adequado para idade", "Atraso no DNPM", "Vacinação em dia", "Vacinação atrasada", "Eliminações fisiológicas normais"],
      },
      {
        titulo: "Exame Físico",
        campo: "exame_fisico",
        opcoes: ["BEG, ativo, reativo", "Corado, hidratado", "Fontanela anterior normotensa", "Pele íntegra", "Coto umbilical (RN): sem sinais de infecção", "Orofaringe sem alterações", "AP e AC sem alterações", "Abdome sem alterações", "Genitália sem alterações", "Reflexos primitivos presentes (RN)"],
      },
      {
        titulo: "Antropometria",
        campo: "sinais_vitais",
        opcoes: ["Peso adequado para idade", "Peso abaixo do esperado", "Peso acima do esperado", "Estatura adequada para idade", "Perímetro cefálico adequado", "Curva de crescimento ascendente", "Curva de crescimento estacionária"],
      },
      {
        titulo: "Diagnóstico de Enfermagem",
        campo: "avaliacao",
        opcoes: ["Crescimento e desenvolvimento adequados", "Risco de nutrição desequilibrada", "Amamentação eficaz", "Amamentação ineficaz", "Risco de infecção", "Conforto prejudicado (cólicas)"],
      },
      {
        titulo: "Intervenções de Enfermagem",
        campo: "conduta",
        opcoes: ["Aferição antropométrica e registro na caderneta", "Avaliação do DNPM", "Orientações sobre aleitamento materno", "Orientações sobre alimentação complementar", "Orientações sobre cuidados com o RN", "Orientações sobre prevenção de acidentes", "Teste do pezinho / orelhinha / olhinho (verificar)", "Administração de vacinas conforme calendário", "Suplementação de ferro/vitamina D", "Encaminhamento para consulta médica se necessário", "Retorno conforme calendário de puericultura"],
      },
    ],
  },
  {
    id: "enf_ap_saude_mulher",
    nome: "Saúde da Mulher",
    descricao: "Consulta de enfermagem ginecológica",
    grupos: [
      {
        titulo: "Motivo da Consulta",
        campo: "queixa_principal",
        opcoes: ["Coleta de citopatológico", "Planejamento familiar", "Corrimento vaginal", "Queixas menstruais", "Consulta de rotina"],
      },
      {
        titulo: "Antecedentes",
        campo: "hda",
        opcoes: ["Ciclos regulares", "Ciclos irregulares", "Uso de contraceptivo", "Não usa contraceptivo", "Citopatológico anterior normal", "Citopatológico anterior alterado", "Mamografia em dia", "Mamografia pendente"],
      },
      {
        titulo: "Exame Físico",
        campo: "exame_fisico",
        opcoes: ["BEG", "Mamas sem alterações", "Mamas com alterações", "Coleta de citopatológico realizada", "Colo sem alterações ao especular", "Presença de corrimento"],
      },
      {
        titulo: "Sinais Vitais",
        campo: "sinais_vitais",
        opcoes: ["PA normal", "PA elevada", "Peso aferido", "IMC calculado"],
      },
      {
        titulo: "Diagnóstico de Enfermagem",
        campo: "avaliacao",
        opcoes: ["Conhecimento deficiente sobre saúde reprodutiva", "Risco de infecção", "Conforto prejudicado", "Ansiedade"],
      },
      {
        titulo: "Intervenções",
        campo: "conduta",
        opcoes: ["Coleta de citopatológico realizada", "Orientações sobre autoexame das mamas", "Orientações sobre planejamento familiar", "Orientações sobre ISTs", "Prescrição de contraceptivo (conforme protocolo)", "Solicitação de mamografia (conforme faixa etária)", "Encaminhamento médico se alterações", "Agendamento de retorno"],
      },
    ],
  },
  {
    id: "enf_ap_saude_crianca",
    nome: "Saúde da Criança",
    descricao: "Atendimento de enfermagem à criança na APS",
    grupos: [
      {
        titulo: "Motivo",
        campo: "queixa_principal",
        opcoes: ["Febre", "Tosse / coriza", "Diarreia", "Dor de ouvido", "Inapetência", "Consulta de acompanhamento"],
      },
      {
        titulo: "Avaliação",
        campo: "hda",
        opcoes: ["Início recente dos sintomas", "Alimentação preservada", "Alimentação reduzida", "Vacinação em dia", "Vacinação atrasada", "Uso de medicação em domicílio"],
      },
      {
        titulo: "Exame Físico",
        campo: "exame_fisico",
        opcoes: ["BEG, ativo", "REG, hipoativo", "Corado, hidratado", "Descorado / desidratado", "Orofaringe hiperemiada", "AP: sem alterações", "AP: presença de sibilos / estertores", "Abdome sem alterações"],
      },
      {
        titulo: "Sinais Vitais",
        campo: "sinais_vitais",
        opcoes: ["Temperatura normal", "Febre", "FC adequada para idade", "FR adequada para idade", "SatO₂ normal", "Peso aferido"],
      },
      {
        titulo: "Classificação de Risco",
        campo: "avaliacao",
        opcoes: ["Sem sinais de perigo — verde", "Algum sinal de alerta — amarelo", "Sinal de perigo — vermelho", "IVAS", "Desidratação leve", "Necessita avaliação médica"],
      },
      {
        titulo: "Intervenções",
        campo: "conduta",
        opcoes: ["Aferição de sinais vitais", "TRO iniciada (se desidratação)", "Orientações sobre hidratação", "Orientações sobre sinais de alarme", "Administração de medicação conforme prescrição", "Encaminhamento para consulta médica", "Encaminhamento para urgência", "Agendamento de retorno"],
      },
    ],
  },
  {
    id: "enf_ap_saude_idoso",
    nome: "Saúde do Idoso",
    descricao: "Consulta de enfermagem ao idoso",
    grupos: [
      {
        titulo: "Motivo da Consulta",
        campo: "queixa_principal",
        opcoes: ["Consulta de rotina", "Queda", "Tontura", "Dor", "Incontinência", "Esquecimento", "Tristeza / isolamento", "Polifarmácia"],
      },
      {
        titulo: "Avaliação Funcional",
        campo: "hda",
        opcoes: ["Independente para AVDs", "Parcialmente dependente", "Dependente", "Marcha estável", "Marcha instável", "Uso de dispositivo auxiliar", "Cognição preservada", "Declínio cognitivo", "Suporte familiar adequado", "Suporte familiar insuficiente"],
      },
      {
        titulo: "Exame Físico",
        campo: "exame_fisico",
        opcoes: ["BEG, lúcido, orientado", "REG, confuso", "Corado, hidratado", "Descorado", "Pele: íntegra", "Pele: lesões", "MMII: sem edema", "MMII: com edema", "Força muscular preservada", "Sarcopenia"],
      },
      {
        titulo: "Sinais Vitais",
        campo: "sinais_vitais",
        opcoes: ["PA normal", "PA elevada", "Hipotensão ortostática", "Glicemia normal", "Glicemia alterada", "Peso aferido", "IMC calculado"],
      },
      {
        titulo: "Diagnóstico de Enfermagem",
        campo: "avaliacao",
        opcoes: ["Risco de queda", "Mobilidade física prejudicada", "Déficit no autocuidado", "Confusão crônica", "Risco de solidão", "Controle ineficaz da saúde", "Integridade da pele prejudicada"],
      },
      {
        titulo: "Intervenções",
        campo: "conduta",
        opcoes: ["Avaliação multidimensional do idoso", "Aplicação de escalas (Katz, Lawton, MEEM, GDS, Morse)", "Revisão medicamentosa", "Orientações sobre prevenção de quedas", "Orientações sobre exercícios", "Orientações ao cuidador", "Encaminhamento para consulta médica", "Encaminhamento para fisioterapia", "Encaminhamento para psicólogo", "Agendamento de retorno"],
      },
    ],
  },
  {
    id: "enf_ap_tuberculose",
    nome: "Tuberculose",
    descricao: "Acompanhamento de enfermagem — TB",
    grupos: [
      {
        titulo: "Motivo",
        campo: "queixa_principal",
        opcoes: ["TDO — dose supervisionada", "Consulta de acompanhamento", "Tosse produtiva", "Febre", "Perda de peso", "Efeitos adversos da medicação", "Assintomático"],
      },
      {
        titulo: "Adesão",
        campo: "hda",
        opcoes: ["TDO regular", "TDO irregular", "Fase intensiva", "Fase de manutenção", "Sem efeitos adversos", "Com efeitos adversos", "Contatos examinados", "Contatos pendentes"],
      },
      {
        titulo: "Exame Físico",
        campo: "exame_fisico",
        opcoes: ["BEG", "REG, emagrecido", "Corado / Descorado", "AP: MV+ sem RA", "AP: presença de RA", "Sem icterícia", "Ictérico"],
      },
      {
        titulo: "Sinais Vitais",
        campo: "sinais_vitais",
        opcoes: ["Afebril", "Febril", "Peso aferido", "Ganho de peso", "Perda de peso", "SatO₂ normal"],
      },
      {
        titulo: "Diagnóstico de Enfermagem",
        campo: "avaliacao",
        opcoes: ["Controle ineficaz da saúde", "Nutrição desequilibrada", "Padrão respiratório ineficaz", "Risco de infecção (contatos)", "Conhecimento deficiente"],
      },
      {
        titulo: "Intervenções",
        campo: "conduta",
        opcoes: ["Administração da dose supervisionada (TDO)", "Aferição de peso e sinais vitais", "Orientações sobre adesão ao tratamento", "Orientações sobre etiqueta respiratória", "Monitoramento de efeitos adversos", "Busca ativa de contatos", "Notificação / atualização SINAN", "Encaminhamento médico se efeitos adversos graves", "Agendamento de retorno para próxima dose"],
      },
    ],
  },
  {
    id: "enf_ap_hanseniase",
    nome: "Hanseníase",
    descricao: "Acompanhamento de enfermagem — Hanseníase",
    grupos: [
      {
        titulo: "Motivo",
        campo: "queixa_principal",
        opcoes: ["Dose supervisionada PQT", "Consulta de acompanhamento", "Manchas na pele", "Dormência / formigamento", "Reação hansênica", "Assintomático"],
      },
      {
        titulo: "Adesão",
        campo: "hda",
        opcoes: ["PQT regular", "PQT irregular", "PB — mês ___/6", "MB — mês ___/12", "Sem efeitos adversos", "Com efeitos adversos", "Contatos examinados", "Contatos pendentes"],
      },
      {
        titulo: "Exame Físico / Dermatoneurológico",
        campo: "exame_fisico",
        opcoes: ["BEG", "Lesões cutâneas estáveis / em regressão", "Novas lesões", "Sensibilidade preservada", "Sensibilidade diminuída", "Nervos sem espessamento", "Nervos com espessamento", "Força muscular preservada", "Deformidade presente"],
      },
      {
        titulo: "Grau de Incapacidade",
        campo: "sinais_vitais",
        opcoes: ["Grau 0", "Grau 1", "Grau 2", "Mãos: sem alterações", "Mãos: com alterações", "Pés: sem alterações", "Pés: com alterações", "Olhos: sem alterações", "Olhos: com alterações"],
      },
      {
        titulo: "Diagnóstico de Enfermagem",
        campo: "avaliacao",
        opcoes: ["Integridade da pele prejudicada", "Percepção sensorial alterada", "Mobilidade física prejudicada", "Imagem corporal perturbada", "Conhecimento deficiente", "Risco de lesão"],
      },
      {
        titulo: "Intervenções",
        campo: "conduta",
        opcoes: ["Administração da dose supervisionada PQT", "Avaliação dermatoneurológica simplificada", "Avaliação do grau de incapacidade", "Orientações sobre autocuidado", "Exercícios de prevenção de incapacidades", "Exame de contatos domiciliares", "Aplicação de BCG em contatos elegíveis", "Monitoramento de reação hansênica", "Notificação / atualização SINAN", "Encaminhamento médico", "Agendamento de retorno mensal"],
      },
    ],
  },
];

export default enfermeiroAtencaoPrimaria;