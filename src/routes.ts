// routes.ts
import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/layout/MainLayout.tsx", [
    index("components/pages/DeviceControllerPage.tsx"),
    route("ar-detection", "components/ARDetectionPage/ARDetectionPage.tsx"),
    route("model-training", "components/ModelTraining/ModelTrainingPage.tsx"),
    route("hydroponic-system", "components/HydroponicSystemPage/HydroponicSystemPage.tsx"),
  ]),

] satisfies RouteConfig;



