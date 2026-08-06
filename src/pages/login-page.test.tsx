import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "@/lib/router-components";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./login-page";

const { preloadWorkspaceMock } = vi.hoisted(() => ({
  preloadWorkspaceMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/app/preload-workspace", () => ({
  preloadWorkspace: preloadWorkspaceMock,
}));

describe("LoginPage", () => {
  beforeEach(() => preloadWorkspaceMock.mockClear());

  it("muestra errores específicos cuando los datos son inválidos", async () => {
    const user = userEvent.setup();
    render(
      <Router>
        <LoginPage />
      </Router>,
    );
    const email = screen.getByLabelText("Correo institucional");
    const password = screen.getByLabelText("Contraseña");
    await user.clear(email);
    await user.type(email, "correo-invalido");
    await user.clear(password);
    await user.type(password, "123");
    await user.click(
      screen.getByRole("button", { name: "Entrar a la demostración" }),
    );
    expect(
      await screen.findByText("Ingresa un correo institucional válido."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("La contraseña debe contener al menos 6 caracteres."),
    ).toBeInTheDocument();
  });

  it("permite mostrar y ocultar la contraseña", async () => {
    const user = userEvent.setup();
    render(
      <Router>
        <LoginPage />
      </Router>,
    );
    const password = screen.getByLabelText("Contraseña");
    expect(password).toHaveAttribute("type", "password");
    await user.click(
      screen.getByRole("button", { name: "Mostrar contraseña" }),
    );
    expect(password).toHaveAttribute("type", "text");
  });

  it("prepara módulos y datos cuando el acceso es válido", async () => {
    const user = userEvent.setup();
    render(
      <Router>
        <LoginPage />
      </Router>,
    );

    await user.click(
      screen.getByRole("button", { name: "Entrar a la demostración" }),
    );

    expect(preloadWorkspaceMock).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("button", { name: "Preparando tu espacio…" }),
    ).toBeDisabled();
  });
});
