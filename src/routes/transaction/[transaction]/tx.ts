import { toolkit } from '../../../radix-engine-toolkit'

export const decompileTxIntent = async () => {
  const decompilemodule = await toolkit()
  if (decompilemodule)
    return decompilemodule('decompile_unknown_transaction_intent')
}
