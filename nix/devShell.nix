{
  mkShell,
  alejandra,
  bash,
  nodejs_23,
}:
mkShell rec {
  name = "schedule-bot";

  packages = [
    # Our Makefile requires a modern bash. If the developer computer is
    # running macOS then it ships with an old broken version of bash.
    # This ensures that the Makefile works. Alternately, we can just
    # fix the Makefile.
    bash
    nodejs_23

    # Required for CI for format checking.
    alejandra
  ];
}
