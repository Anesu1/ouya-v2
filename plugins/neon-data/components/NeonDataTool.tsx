"use client"

import { useState } from "react"
import { Box, Card, Container, Flex, Stack, TabList, TabPanel, Text } from "@sanity/ui"
import { Tab } from "./Tab"
import OrdersPanel from "./OrdersPanel"
import UsersPanel from "./UsersPanel"
import { AuthCheck } from "./AuthCheck"

export default function NeonDataTool() {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <AuthCheck>
      <Container width={5} padding={4}>
        <Stack space={4}>
          <Card padding={3} radius={2} shadow={1}>
            <Flex align="center" justify="space-between">
              <Text size={2} weight="semibold">
                Neon Database Dashboard
              </Text>
            </Flex>
          </Card>

          <Card padding={1} radius={2} shadow={1}>
            <TabList space={2}>
              <Tab
                aria-controls="orders-panel"
                id="orders-tab"
                label="Orders"
                onClick={() => setActiveTab("orders")}
                selected={activeTab === "orders"}
              />
              <Tab
                aria-controls="users-panel"
                id="users-tab"
                label="Users"
                onClick={() => setActiveTab("users")}
                selected={activeTab === "users"}
              />
            </TabList>

            <Box padding={3}>
              <TabPanel aria-labelledby="orders-tab" hidden={activeTab !== "orders"} id="orders-panel">
                <OrdersPanel />
              </TabPanel>

              <TabPanel aria-labelledby="users-tab" hidden={activeTab !== "users"} id="users-panel">
                <UsersPanel />
              </TabPanel>
            </Box>
          </Card>
        </Stack>
      </Container>
    </AuthCheck>
  )
}
