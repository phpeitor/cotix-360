# Cálculo de variables en Cotix360

Este documento resume las fórmulas y convenciones usadas en el cálculo de totales dentro del módulo de cotizaciones y recetas.

## Notación

- $q_i$: cantidad del ítem $i$.
- $p^{S}_i$: precio del ítem $i$ en soles.
- $p^{D}_i$: precio del ítem $i$ en dólares.
- $tc$: tipo de cambio (SUNAT, venta), mostrado con 3 decimales.

## Fórmulas principales

- Total items:

  $\displaystyle total\_items=\sum_i q_i$

- Total en soles:

  $\displaystyle total\_soles=\sum_i q_i\cdot p^{S}_i$

- Total en dólares:

  $\displaystyle total\_dolares=\sum_i q_i\cdot p^{D}_i$

- Total Perú (suma convertida a S/.) — se usa para mostrar el total combinado en moneda local:

  $\displaystyle total\_peru = total\_soles + total\_dolares\cdot tc$

## Regla de conversión por item

Si un ítem solo tiene precio en dólares y se requiere su equivalente en soles para cálculos locales:

  $\displaystyle p^{S}_i = p^{D}_i\cdot tc$

o, inversamente, para pasar soles a dólares:

  $\displaystyle p^{D}_i = \frac{p^{S}_i}{tc}$

## Redondeos y presentación

- Montos en soles: mostrar con 2 decimales (ej. `123.45`).
- Montos en dólares: mostrar con 2 decimales (ej. `12.34`).
- Tipo de cambio: mostrar con 3 decimales (ej. `3.940`).
- En las comparaciones entre suma teórica y suma de líneas, puede aplicarse un ajuste por redondeo local; se recomienda conservar precisión interna y solo redondear al presentar.

## Ejemplo

Suponga dos líneas:

- Ítem A: $q_A=2$, $p^{S}_A=10.00$ (S/.)
- Ítem B: $q_B=1$, $p^{D}_B=5.00$ ($$)
- $tc=3.900$

Entonces:

- $total\_soles = 2\cdot10.00 = 20.00$
- $total\_dolares = 1\cdot5.00 = 5.00$
- $total\_peru = 20.00 + 5.00\cdot3.900 = 39.50$

---

Si necesitas que incluya ejemplos con impuestos, flete o la integración de interés/factor en los totales, puedo extender este documento con diagramas y casos de prueba.
