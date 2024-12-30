import { Anchor, Grid, Footer as MFooter, Text } from "@mantine/core";
import useConfig from "../../hooks/config.hook";
import { TbBrandGithub } from "react-icons/tb";
import useTranslate from "../../hooks/useTranslate.hook";

const Footer = () => {
	const t = useTranslate();
	const config = useConfig();
	const hasImprint = !!(config.get("legal.imprintUrl") || config.get("legal.imprintText"));
	const hasPrivacy = !!(config.get("legal.privacyPolicyUrl") || config.get("legal.privacyPolicyText"));
	const imprintUrl = (!config.get("legal.imprintText") && config.get("legal.imprintUrl")) || "/imprint";
	const privacyUrl = (!config.get("legal.privacyPolicyText") && config.get("legal.privacyPolicyUrl")) || "/privacy";
	return (
		<MFooter height="auto" p={10}>
			<Grid columns={3}>
				<Grid.Col span={1}>
					{config.get("legal.enabled") && (
						<Text size="xs" color="dimmed" align="left">
							{hasImprint && (
								<Anchor size="xs" href={imprintUrl}>
									{t("imprint.title")}
								</Anchor>
							)}
							{hasImprint && hasPrivacy && " • "}
							{hasPrivacy && (
								<Anchor size="xs" href={privacyUrl}>
									{t("privacy.title")}
								</Anchor>
							)}
						</Text>
					)}
				</Grid.Col>
				<Grid.Col span={1}>
					<Text size="xs" color="dimmed" align="center">
						Powered by{" "}
						<Anchor size="xs" href="https://stonith404.github.io/pingvin-share/" target="_blank">
							Pingvin Share
						</Anchor>
					</Text>
				</Grid.Col>
				<Grid.Col span={1}>
					<Text size="xs" color="dimmed" align="right">
						<Anchor href="https://github.com/stonith404/pingvin-share" target="_blank">
							<TbBrandGithub size={14} />{" "}
						</Anchor>
					</Text>
				</Grid.Col>
			</Grid>
		</MFooter>
	);
};

export default Footer;
