import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Drawer } from "@/components/ui/drawer";

function DrawerFixture() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button id="drawer-trigger" onClick={() => setOpen(true)}>
        Abrir navegación
      </button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Navegación principal"
        returnFocusId="drawer-trigger"
      >
        <a href="/app">Resumen</a>
      </Drawer>
    </>
  );
}

describe("Drawer", () => {
  it("abre, recibe foco y se cierra con Escape", async () => {
    const user = userEvent.setup();
    render(<DrawerFixture />);

    await user.click(screen.getByRole("button", { name: "Abrir navegación" }));
    expect(
      screen.getByRole("dialog", { name: "Navegación principal" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Navegación principal" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Abrir navegación" }),
    ).toHaveFocus();
  });
});
