import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Heart, Building2, Trees, ArrowLeft, FileText, Sparkles, LogOut, History } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import WizardHeader from "../components/WizardHeader";
import StepCard from "../components/StepCard";
import CheckboxGroup from "../components/CheckboxGroup";
import EvolutionPreview from "../components/EvolutionPreview";
import { getTemplates, generateEvolutionText } from "../lib/evolutionTemplates";
import { fillParameter } from "../components/ParameterInput";
import PatientInfoForm from "../components/PatientInfoForm";
import VentilacaoMecanica, { getVMSummaryText } from "../components/VentilacaoMecanica";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CaseSensitive } from "lucide-react";

const STEPS = {
  PROFILE: 0,
  ENVIRONMENT: 1,
  TEMPLATE: 2,
  BUILDER: 3,
  RESULT: 4,
};

export default function Home() {
  const navigate = useNavigate();
  const [appUser, setAppUser] = useState(null);
  const [step, setStep] = useState(STEPS.PROFILE);
  const [perfil, setPerfil] = useState(null);
  const [ambiente, setAmbiente] = useState(null);
  const [template, setTemplate] = useState(null);
  const [selections, setSelections] = useState({});
  const [freeText, setFreeText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [uppercase, setUppercase] = useState(false);
  const [patientInfo, setPatientInfo] = useState({ nome: "", idade: "", dataAdmissao: "", diagnostico: "", sexo: "" });
  const [paramValues, setParamValues] = useState({});
  const [vmData, setVmData] = useState({ modo: null, params: {}, enabled: false });

  useEffect(() => {
    const stored = localStorage.getItem("evolua_user");
    if (!stored) {
      navigate("/");
      return;
    }
    const user = JSON.parse(stored);
    setAppUser(user);
    setStep(STEPS.PROFILE);
  }, [navigate]);

  const goBack = () => {
    if (step === STEPS.RESULT) {
      setStep(STEPS.BUILDER);
      setGeneratedText("");
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("evolua_user");
    navigate("/");
  };

  const resetAll = () => {
    setStep(STEPS.ENVIRONMENT);
    setAmbiente(null);
    setTemplate(null);
    setSelections({});
    setFreeText("");
    setGeneratedText("");
    setPatientInfo({ nome: "", idade: "", dataAdmissao: "", diagnostico: "", sexo: "" });
    setParamValues({});
    setVmData({ modo: null, params: {}, enabled: false });
  };

  const selectProfile = (p) => {
    setPerfil(p);
    setStep(STEPS.ENVIRONMENT);
  };

  const selectEnvironment = (e) => {
    setAmbiente(e);
    setStep(STEPS.TEMPLATE);
  };

  const selectTemplate = (t) => {
    setTemplate(t);
    setSelections({});
    setFreeText("");
    setParamValues({});
    setVmData({ modo: null, params: {}, enabled: false });
    setStep(STEPS.BUILDER);
  };

  const toggleOption = useCallback((campo, opcao) => {
    setSelections((prev) => {
      const current = prev[campo] || [];
      const updated = current.includes(opcao)
        ? current.filter((o) => o !== opcao)
        : [...current, opcao];
      return { ...prev, [campo]: updated };
    });
  }, []);

  const handleParamChange = (opcao, value) => {
    setParamValues((prev) => ({ ...prev, [opcao]: value }));
  };

  const handleGenerate = async () => {
    let text = generateEvolutionText(perfil, template, selections, freeText, patientInfo, paramValues, vmData);
    if (uppercase) text = text.toUpperCase();
    setGeneratedText(text);
    setStep(STEPS.RESULT);

    // Save to database
    await base44.entities.Evolution.create({
      profile: perfil,
      environment: ambiente,
      template_name: template.nome,
      patient_name: patientInfo.nome || "",
      text: text,
      app_user_id: appUser.id,
      app_user_name: appUser.full_name,
    });
  };

  const totalSelections = Object.values(selections).reduce((sum, arr) => sum + arr.length, 0);
  const templates = perfil && ambiente ? getTemplates(perfil, ambiente) : [];

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const firstName = appUser?.full_name?.split(" ")[0] || "";

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Colorful header like reference */}
      {step <= STEPS.PROFILE && appUser && (
        <div
          className="w-full px-5 pt-6 pb-10"
          style={{
            background: "linear-gradient(135deg, #e84393 0%, #6c5ce7 30%, #0984e3 70%, #74b9ff 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 text-white font-bold text-lg">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold text-base">Olá, {firstName} 👋</p>
                <p className="text-white/70 text-xs">Trocar de perfil</p>
              </div>
            </div>
            <TooltipProvider delayDuration={300}>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate("/historico")}
                      className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
                    >
                      <History className="w-4 h-4 text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Histórico</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleLogout}
                      className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"
                    >
                      <LogOut className="w-4 h-4 text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Sair</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      )}

      <div className={`max-w-2xl mx-auto px-4 ${step <= STEPS.PROFILE && appUser ? "-mt-6" : "pt-6"} pb-6 sm:py-8`}>
        {/* Show user bar on other steps */}
        {step > STEPS.PROFILE && appUser && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{appUser.full_name}</span>
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        )}

        {step <= STEPS.PROFILE && (
          <div className="rounded-2xl bg-card shadow-lg shadow-black/5 border border-border/50 p-5 mb-6">
            <WizardHeader currentStep={step} totalSteps={5} />
          </div>
        )}

        {step > STEPS.PROFILE && (
          <WizardHeader currentStep={step} totalSteps={5} />
        )}

        {step > STEPS.PROFILE && step < STEPS.RESULT && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === STEPS.PROFILE && (
            <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-3">
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-foreground">Qual é o seu perfil?</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Selecione para personalizar os modelos</p>
              </div>

              <StepCard image="https://media.base44.com/images/public/69c449b402b70173b105d075/a4d2476d3_Sade46.png" title="Médico(a)" description="Modelos de evolução médica" onClick={() => selectProfile("medico")} delay={0.05} colorIndex={0} />
              <StepCard image="https://media.base44.com/images/public/69c449b402b70173b105d075/17c6f3957_Sade47.png" title="Enfermeiro(a)" description="Modelos de evolução de enfermagem" onClick={() => selectProfile("enfermeiro")} delay={0.12} colorIndex={1} />
            </motion.div>
          )}

          {step === STEPS.ENVIRONMENT && (
            <motion.div key="environment" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-3">
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-foreground">Ambiente de atuação</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Onde você está atendendo?</p>
              </div>

              <StepCard image="https://media.base44.com/images/public/69c449b402b70173b105d075/d0291b67a_Sade49.png" title="Atenção Primária à Saúde" description="UBS, ESF, Postos de Saúde" onClick={() => selectEnvironment("atencao_primaria")} delay={0.05} colorIndex={1} />
              <StepCard image="https://media.base44.com/images/public/69c449b402b70173b105d075/4c1b200fd_Sade50.png" title="Ambiente Hospitalar" description="Enfermarias, UTI, Pronto-Socorro" onClick={() => selectEnvironment("ambiente_hospitalar")} delay={0.12} colorIndex={2} />
            </motion.div>
          )}

          {step === STEPS.TEMPLATE && (
            <motion.div key="template" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-3">
              <div className="mb-6">
                <h2 className="text-lg font-extrabold text-foreground">Escolha o modelo</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Selecione o tipo de evolução</p>
              </div>

              {templates.map((t, idx) => (
                <StepCard key={t.id} icon={FileText} title={t.nome} description={t.descricao} onClick={() => selectTemplate(t)} delay={0.05 * (idx + 1)} colorIndex={idx} />
              ))}

              {templates.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <p>Nenhum modelo disponível para esta combinação.</p>
                </div>
              )}
            </motion.div>
          )}

          {step === STEPS.BUILDER && template && (
            <motion.div key="builder" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-foreground">{template.nome}</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Selecione as opções aplicáveis ao paciente</p>
              </div>

              <PatientInfoForm patientInfo={patientInfo} onChange={setPatientInfo} ambiente={ambiente} />

              {template.grupos.map((grupo) => (
                <React.Fragment key={grupo.campo}>
                  <CheckboxGroup
                    titulo={grupo.titulo}
                    opcoes={grupo.opcoes}
                    selected={selections[grupo.campo] || []}
                    sexo={patientInfo.sexo}
                    onToggle={(opcao) => {
                      toggleOption(grupo.campo, opcao);
                      // If unchecking VM, clear VM data
                      if (opcao === "Em ventilação mecânica invasiva" && (selections[grupo.campo] || []).includes(opcao)) {
                        setVmData({ modo: null, params: {}, enabled: false });
                      }
                    }}
                    paramValues={paramValues}
                    onParamChange={handleParamChange}
                  />
                  {/* Show VM form right after Respiratório when VM checkbox is selected */}
                  {grupo.campo === "respiratorio" &&
                    ambiente === "ambiente_hospitalar" &&
                    (selections["respiratorio"] || []).includes("Em ventilação mecânica invasiva") && (
                      <VentilacaoMecanica value={vmData} onChange={setVmData} />
                  )}
                </React.Fragment>
              ))}

              <div className="rounded-2xl bg-card shadow-sm shadow-black/5 border border-border/50 p-4 space-y-2">
                <h3 className="font-bold text-foreground text-sm">Observações Adicionais</h3>
                <Textarea
                  placeholder="Adicione informações complementares, valores de sinais vitais, detalhes específicos..."
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  className="min-h-[100px] resize-none rounded-xl bg-background border-border/60"
                />
              </div>

              <div className="rounded-2xl bg-card shadow-sm shadow-black/5 border border-border/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CaseSensitive className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="uppercase-builder" className="text-xs text-muted-foreground cursor-pointer">LETRAS MAIÚSCULAS</Label>
                </div>
                <Switch
                  id="uppercase-builder"
                  checked={uppercase}
                  onCheckedChange={setUppercase}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={totalSelections === 0}
                size="lg"
                className="w-full gap-2 text-base h-13 font-bold rounded-xl text-white"
                style={{
                  background: totalSelections > 0
                    ? "linear-gradient(135deg, #e84393, #6c5ce7, #0984e3)"
                    : undefined,
                }}
              >
                <Sparkles className="w-5 h-5" />
                Gerar Evolução ({totalSelections} {totalSelections === 1 ? "item" : "itens"})
              </Button>
            </motion.div>
          )}

          {step === STEPS.RESULT && (
            <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-foreground">Evolução Gerada ✨</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Revise, copie ou exporte o texto</p>
              </div>

              <EvolutionPreview text={generatedText} onClear={resetAll} uppercase={uppercase} onToggleUppercase={setUppercase} />

              <div className="flex gap-2 pt-1">
                <Button variant="outline" onClick={goBack} className="flex-1 h-12 rounded-xl border-border/60 font-semibold" size="lg">
                  Editar seleções
                </Button>
                <Button variant="outline" onClick={resetAll} className="flex-1 h-12 rounded-xl border-border/60 font-semibold" size="lg">
                  Nova evolução
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}