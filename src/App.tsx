import AppRoutes from "@/route/AppRoutes";
import { AlertProvider } from   "@/utils/AlertProvider";
function App() {
  return (
    <div>
      <AlertProvider>
        <AppRoutes />
      </AlertProvider>
    </div>
  );
}

export default App;
