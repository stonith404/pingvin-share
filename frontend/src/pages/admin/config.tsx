import { Space, Title } from "@mantine/core";
import AdminConfigTable from "../../components/admin/configuration/AdminConfigTable";
import Meta from "../../components/Meta";

const AdminConfig = () => {
  return (
    <>
      <Meta title="Configuration" />
      <Title mb={30} order={3}>
        Configuration
      </Title>
      <AdminConfigTable />
      <Space h="xl" />
    </>
  );
};

export default AdminConfig;
