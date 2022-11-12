library(tidyverse)

target_color = "#d55e00" # red
comp_color = "#009e74" # blueish green
contrast_color = "#e69d00" # orange
distractor_2_color = "#f0e442" # yellow; always present
distractor_1_color = "#f0e442" # yellow; encoded as contrast

typical_color = "#cc79a7" # purple
atypical_color = "#79a7cc" # blue
mixed_color = "#a7cc79"

df_emp_noprior = read_csv("vis_data/emp_noprevsel_noprior.csv",col_names = TRUE) %>% 
  select(condition, obj_in_display_diff, clicked) %>%
  mutate(prior = "no prior") %>% 
  mutate(data_type = "empirical") %>% 
  mutate(sel = "Empirical: No prior")
df_emp_prior = read_csv("vis_data/emp_noprevsel_prior.csv",col_names = TRUE) %>% 
  select(prior, condition, obj_in_display_diff, clicked) %>% 
  mutate(data_type = "empirical") %>% 
  mutate(sel = ifelse(prior=="normal", "Empirical: Typical prior", "Empirical: Atypical prior"))

df_emp_prevsel = read_csv("vis_data/emp_prevsel_noprior.csv",col_names = TRUE) %>% 
  # filter(timeStep_selec == "selectedItem_prior") %>% 
  # select(condition, obj_in_display_diff, clicked) %>% 
  mutate(prior = "no prior") %>% 
  mutate(data_type = "empirical") %>% 
  mutate(sel = "Empirical: No prior (pre-adj)")

df_emp_prevsel_prior = read_csv("vis_data/emp_prevsel_prior.csv",col_names = TRUE) %>% 
  # filter(timeStep_selec == "selectedItem_prior") %>% 
  # select(prior, condition, obj_in_display_diff, clicked) %>% 
  mutate(data_type = "empirical") %>% 
  mutate(sel = ifelse(prior=="normal", "Empirical: Typical prior (pre-adj)", "Empirical: Atypical prior (pre-adj)"))

df_model_noprior = read_csv("vis_data/model_flatprior.csv",col_names = TRUE) %>% 
  select(prior, condition, obj_in_display_diff, clicked) %>% 
  mutate(data_type = "model") %>% 
  mutate(sel = "Model: No prior")
df_model_prior = read_csv("vis_data/model_prior.csv",col_names = TRUE) %>% 
  select(prior, condition, obj_in_display_diff, clicked) %>% 
  mutate(data_type = "model") %>% 
  mutate(sel = ifelse(prior=="normal", "Model: Typical prior", "Model: Atypical prior"))

df = df_emp_noprior %>%
  bind_rows(df_emp_prior) %>%
  bind_rows(df_model_noprior) %>% 
  bind_rows(df_model_prior) %>% 
  bind_rows(df_emp_prevsel) %>% 
  bind_rows(df_emp_prevsel_prior) %>% 
  mutate(color_item = obj_in_display_diff) %>% 
  mutate_at(vars(color_item), funs(
    case_when(
      .=="target" ~ target_color,
      .=="comp" ~ comp_color,
      .=="contrast" ~ contrast_color,
      .=="distractor1" ~ distractor_1_color,
      .=="distractor" ~ distractor_2_color,
      .=="distractor2" ~ distractor_2_color,
      TRUE ~ "black"
    )
  )) %>% 
  mutate(color_typ = case_when(
    # target, comp and contrast typicality is always well defined
    obj_in_display_diff == "target" & str_sub(condition,1,1) == "t" ~ "typical",
    obj_in_display_diff == "target" & str_sub(condition,1,1) == "a" ~ "atypical",
    obj_in_display_diff == "comp" & str_sub(condition,2,2) == "t" ~ "typical",
    obj_in_display_diff == "comp" & str_sub(condition,2,2) == "a" ~ "atypical",
    obj_in_display_diff == "contrast" & str_sub(condition,1,1) == "t" ~ "atypical",
    obj_in_display_diff == "contrast" & str_sub(condition,1,1) == "a" ~ "typical",
    # distractor typicalities are only well defined in the prior condition cases
    prior != "no prior" & obj_in_display_diff == "distractor1" 
    & str_sub(condition,1,1) == "t" ~ "atypical",
    prior != "no prior" & obj_in_display_diff == "distractor1" 
    & str_sub(condition,1,1) == "a" ~ "typical",
    prior != "no prior" 
    & (obj_in_display_diff == "distractor" | obj_in_display_diff == "distractor2") 
    & str_sub(condition,1,1) == "t" ~ "typical",
    prior != "no prior" 
    & (obj_in_display_diff == "distractor" | obj_in_display_diff == "distractor2") 
    & str_sub(condition,1,1) == "a" ~ "atypical",
    # in the no prior cases, typicalities are mixed
    prior == "no prior" ~ "mixed",
    TRUE ~ "FIRE"
  )) %>% 
  mutate_at(vars(color_typ), funs(case_when(
    .=="typical" ~ typical_color,
    .=="atypical" ~ atypical_color,
    .=="mixed" ~ mixed_color,
    TRUE ~ "black"
  ))) %>% 
  mutate(color_condition = case_when(
    condition=="atp" ~ "#c9df8a",
    condition=="ttp" ~ "#77ab59",
    condition=="aap" ~ "#36802d",
    condition=="tap" ~ "#234d20",
    condition=="atn" ~ "#edc951",
    condition=="ttn" ~ "#eb6841",
    condition=="aan" ~ "#cc2a36",
    condition=="tan" ~ "#cc2a87",
    TRUE ~ "black"
  )) %>% 
  mutate(color_condition_corr = color_condition)

write_csv(df, "df_full.csv")
