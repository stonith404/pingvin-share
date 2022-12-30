import { Space, Title } from "@mantine/core";
import AdminConfigTable from "../../components/admin/configuration/AdminConfigTable";

const AdminConfig = () => {
  return (
    <>
      <Title mb={30} order={3}>
        Configuration
      </Title>
      <AdminConfigTable />
      <Space h="xl" />
    </>
  );
};

export default AdminConfig;
