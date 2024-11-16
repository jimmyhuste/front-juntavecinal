import * as React from 'react';
import { Container, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useValidateRoleAndAccessToken } from '../middlewares/validateRoleAndAccessToken';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { FaUsers } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Dashboard = () => {
  const { themes, theme } = useTheme();
  useValidateRoleAndAccessToken(["1"]); 
  const [dashboardData, setDashboardData] = React.useState(null);

  const textColor = theme === 'light' ? '#1f2937' : '#ffffff';
  const cardBgColor = theme === 'light' ? '#ffffff' : 'rgb(55 65 81)';
  const containerBgColor = theme === 'light' ? '#f3f4f6' : 'rgb(31 41 55)';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/users/kpis/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const transformDemographicData = (data) => {
    if (!data) return [];
    return [
      { value: data.menor, label: 'Niños', color: '#38bdf8' },
      { value: data.adolescente, label: 'Adolescentes', color: '#14b8a6' },
      { value: data.adulto, label: 'Adultos', color: '#c084fc' },
      { value: data.tercera_edad, label: 'Tercera Edad', color: '#f472b6' }
    ].filter(item => item.value > 0);
  };

  const transformMonthlyData = (data) => {
    if (!data) return [];
    return data.map(item => ({
      month: new Date(item.month).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
      visits: item.count
    }));
  };

  // Configuración común para los gráficos
  const chartSettings = {
    width: 450,
    height: 250,
    margin: { top: 20, bottom: 20, left: 20, right: 20 },
  };

  // Configuración específica para gráficos circulares
  const pieChartSettings = {
    width: 450,
    height: 250,
    margin: { top: 20, bottom: 20, left: 20, right: 120 },
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      padding: 0,
      itemGap: 12,
      labelStyle: {
        fill: textColor,
        fontSize: 12,
      },
    }
  };

  // Configuración para gráficos de barras
  const barChartSettings = {
    width: 450,
    height: 250,
    margin: { top: 20, bottom: 40, left: 40, right: 120 },
    legend: {
      direction: 'column',
      position: { vertical: 'middle', horizontal: 'right' },
      itemGap: 12,
      labelStyle: {
        fill: textColor,
        fontSize: 12,
      },
    }
  };

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: themes.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getTooltipContent = (params) => {
    return `${params.value} usuarios`;
  };

  return (
    <Container sx={{ width: '95%', margin: '0 auto', paddingTop: 4, paddingBottom: 4 }} style={{ backgroundColor: themes.background }}>
      <div style={{ backgroundColor: containerBgColor }} className="rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: textColor }}>
          Dashboard de la Comunidad Vecinal
        </h2>

        {/* Card para Total de Usuarios */}
        <div className="mb-8">
          <div style={{ backgroundColor: cardBgColor }} className="p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: textColor }}>
                  Total de Usuarios Registrados
                </h3>
                <p className="text-4xl font-bold" style={{ color: '#38bdf8' }}>
                  {dashboardData.cantidad_usuarios_registrados}
                </p>
              </div>
              <FaUsers size={48} className="text-blue-400" />
            </div>
          </div>
        </div>

        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <div style={{ backgroundColor: cardBgColor }} className="p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
                Demografía de Usuarios y Miembros
              </h3>
              <PieChart
                colors={['#38bdf8', '#14b8a6', '#c084fc', '#f472b6']}
                series={[{
                  data: transformDemographicData(dashboardData.demografia_usuarios_y_miembros),
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  valueFormatter: (item) => `${item.value} usuarios`,
                  arcLabel: null,
                  tooltip: {
                    formatter: (params) => `${params.name}: ${params.value} usuarios`
                  }
                }]}
                {...pieChartSettings}
              />
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div style={{ backgroundColor: cardBgColor }} className="p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
                Distribución de Solicitudes por Tipo de Persona
              </h3>
              <PieChart
                colors={['#38bdf8', '#14b8a6', '#c084fc', '#f472b6']}
                series={[{
                  data: transformDemographicData(dashboardData.cantidad_solicitudes_tipo_persona),
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  valueFormatter: (item) => `${item.value} solicitudes`,
                  arcLabel: null,
                  tooltip: {
                    formatter: (params) => `${params.name}: ${params.value} solicitudes`
                  }
                }]}
                {...pieChartSettings}
              />
            </div>
          </Grid>

          <Grid item xs={12} md={6}>
            <div style={{ backgroundColor: cardBgColor }} className="p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
                Solicitudes Mensuales
              </h3>
              <BarChart
                colors={['#14b8a6']}
                dataset={transformMonthlyData(dashboardData.cantidad_solicitudes_mensuales)}
                xAxis={[{
                  scaleType: 'band',
                  dataKey: 'month',
                  tickLabelStyle: { fill: textColor }
                }]}
                series={[
                  { 
                    dataKey: 'visits',
                    valueFormatter: (value) => `${value} solicitudes`,
                  }
                ]}
                yAxis={[{
                  tickLabelStyle: { fill: textColor }
                }]}
                {...barChartSettings}
                legend={{ hidden: true }}
                margin={{ top: 20, bottom: 40, left: 40, right: 20 }}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Dashboard;