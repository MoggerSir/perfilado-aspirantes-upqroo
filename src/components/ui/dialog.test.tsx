import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

describe("Dialog", () => {
  it("abre el contenido, se cierra con Escape y devuelve el foco", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Abrir documento</DialogTrigger>
        <DialogContent
          title="Preparar documento"
          description="Revisa los datos antes de continuar."
        >
          <button>Confirmar</button>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Abrir documento" });
    await user.click(trigger);
    expect(
      screen.getByRole("dialog", { name: "Preparar documento" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Preparar documento" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
