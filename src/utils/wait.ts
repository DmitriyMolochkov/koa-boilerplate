export async function wait(milliseconds: number) {
  await new Promise((r) => {
    setTimeout(r, milliseconds);
  });
}
