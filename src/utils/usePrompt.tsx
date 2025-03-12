import { createContext, useReducer, useContext, type ReactNode } from "react";
import { PromptManager } from "./PromptManager";

interface PromptState {
  promptMgr?: PromptManager;
}

const initialState: PromptState = {
  promptMgr: undefined,
};

interface PromptAction {
  type: string;
  data: any;
}

export const PromptAction_Init = "promo_init";

const PromptReducer = (
  state: PromptState,
  action: PromptAction
): PromptState => {
  let newState;
  switch (action.type) {
    case PromptAction_Init:
      newState = { ...state, promptMgr: action.data };
      break;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
  // console.log(JSON.stringify(newState, null, 2));
  return newState;
};

interface PromptContextType {
  state: PromptState;
  dispatch: React.Dispatch<PromptAction>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

interface PromptProviderProps {
  children: ReactNode;
}

export const PromptProvider: React.FC<PromptProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(PromptReducer, initialState);
  return (
    <PromptContext.Provider value={{ state, dispatch }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error("usePromptyContext must be used within a PromptPovider");
  }
  return context;
};
